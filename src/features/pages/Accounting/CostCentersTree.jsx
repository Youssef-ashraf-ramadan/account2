import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getCostCentersTree, getCostCenterDetails, deleteCostCenter, toggleCostCenterStatus, clearError, clearSuccess, clearCostCenterDetails } from '../../../redux/Slices/authSlice';
import CostCenterModal from './CostCenterModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toast } from 'react-toastify';
import './AccountsTree.css';

const JSTREE_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.17/themes/default/style.min.css';
const JQUERY_JS = 'https://code.jquery.com/jquery-3.7.1.min.js';
const JSTREE_JS = 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.17/jstree.min.js';

function loadOnce(tagName, id, attributes = {}) {
  if (document.getElementById(id)) {
    if (tagName === 'script') {
      if (id === 'jquery-js' && (window.jQuery || window.$)) {
        return Promise.resolve();
      }
      if (id === 'jstree-js' && window.jQuery && window.jQuery.fn && window.jQuery.fn.jstree) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (id === 'jquery-js' && (window.jQuery || window.$)) {
            clearInterval(checkInterval);
            resolve();
          } else if (id === 'jstree-js' && window.jQuery && window.jQuery.fn && window.jQuery.fn.jstree) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 5000);
      });
    }
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const el = document.createElement(tagName);
    el.id = id;
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
    if (tagName === 'script') {
      el.onload = () => {
        if (id === 'jquery-js') {
          if (window.jQuery || window.$) resolve();
          else setTimeout(() => resolve(), 100);
        } else if (id === 'jstree-js') {
          if (window.jQuery && window.jQuery.fn && window.jQuery.fn.jstree) resolve();
          else setTimeout(() => resolve(), 100);
        } else {
          resolve();
        }
      };
      el.onerror = reject;
    } else {
      el.onload = () => resolve();
      el.onerror = reject;
    }
    if (tagName === 'link') document.head.appendChild(el);
    else document.body.appendChild(el);
  });
}

const CostCentersTree = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { costCentersTree, costCenterDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [pendingAction, setPendingAction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, node: null });
  const [libsLoaded, setLibsLoaded] = useState(false);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const openNodeIdsRef = useRef([]);
  const selectedNodeIdRef = useRef(null);

  const getJsTreeInstance = () => {
    const $global = window.jQuery || window.$;
    if (!$global || !treeContainerRef.current) return null;
    if (!$global.fn || !$global.fn.jstree) return null;
    try {
      const inst = $global(treeContainerRef.current).jstree(true);
      return inst && typeof inst.get_selected === 'function' ? inst : null;
    } catch {
      return null;
    }
  };
  const treeContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        await loadOnce('link', 'jstree-css', { rel: 'stylesheet', href: JSTREE_CSS });
        await loadOnce('script', 'jquery-js', { src: JQUERY_JS });
        
        let attempts = 0;
        while (!(window.jQuery || window.$) && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        await loadOnce('script', 'jstree-js', { src: JSTREE_JS });
        
        attempts = 0;
        while (!(window.jQuery && window.jQuery.fn && window.jQuery.fn.jstree) && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (isMounted) {
          setLibsLoaded(true);
        }
      } catch (e) {
        console.error('Failed to load jsTree dependencies', e);
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  // Fetch data and clear details when component mounts or route changes
  useEffect(() => {
    dispatch(getCostCentersTree());
    dispatch(clearCostCenterDetails());
    setSelectedNode(null);
  }, [dispatch, location.pathname]);

  // Clear details when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCostCenterDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!error || !pendingAction) return;
    if (pendingAction === 'toggle' || pendingAction === 'delete') {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
    }
    const timer = setTimeout(() => {
      dispatch(clearError());
      setPendingAction(null);
    }, 100);
    return () => clearTimeout(timer);
  }, [error, pendingAction, dispatch]);

  useEffect(() => {
    if (!success) return;
    if (pendingAction === 'toggle' || pendingAction === 'delete') {
      toast.success(success, { rtl: true });
    }

    if (pendingAction === 'add' || pendingAction === 'edit' || pendingAction === 'delete' || showModal) {
      const inst = getJsTreeInstance();
      if (inst) {
        try {
          openNodeIdsRef.current = inst.get_open_nodes ? inst.get_open_nodes() : [];
          const sel = inst.get_selected ? inst.get_selected() : [];
          selectedNodeIdRef.current = (sel && sel.length > 0 && pendingAction !== 'delete') ? sel[0] : null;
        } catch {}
      }
      
      if (pendingAction === 'delete') {
        dispatch(clearCostCenterDetails());
      }
      
      dispatch(getCostCentersTree());
      setShowModal(false);
    } else if (pendingAction === 'toggle' && costCenterDetails?.id) {
      dispatch(getCostCenterDetails(costCenterDetails.id));
    }

    setPendingAction(null);
    dispatch(clearSuccess());
  }, [success, pendingAction, showModal, costCenterDetails, dispatch]);

  const flattenTree = (nodes, allNodes = []) => {
    if (!nodes || !Array.isArray(nodes)) return allNodes;
    
    nodes.forEach(node => {
      allNodes.push({
        id: String(node.id),
        parent: node.parent_id ? String(node.parent_id) : '#',
        text: node.name_ar || node.name || `المركز ${node.id}`,
        type: 'default',
        data: node,
        li_attr: { 
          'data-node-data': JSON.stringify(node)
        }
      });
      
      if (node.children && node.children.length > 0) {
        flattenTree(node.children, allNodes);
      }
    });
    
    return allNodes;
  };

  useEffect(() => {
    if (!libsLoaded) return;
    
    const $global = window.jQuery || window.$;
    if (!$global || !treeContainerRef.current) return;
    if (!costCentersTree || costCentersTree.length === 0) return;
    
    if (!$global.fn || !$global.fn.jstree) {
      console.warn('jsTree plugin not loaded yet');
      return;
    }

    const $el = $global(treeContainerRef.current);
    try { $el.jstree('destroy'); } catch {}

    const jsTreeData = flattenTree(costCentersTree);

    $el.jstree({
      core: {
        data: jsTreeData,
        multiple: false,
        animation: 0,
        check_callback: false,
        themes: {
          variant: 'default',
          stripes: true,
          dots: true,
          icons: true
        }
      },
      plugins: ['wholerow', 'types'],
      types: {
        default: { 
          icon: 'jstree-folder',
          valid_children: ['default']
        }
      }
    });

    $el.on('ready.jstree', function() {
      $el.jstree(true).get_container().delegate('a.jstree-anchor', 'click', function(e) {
        const jstree = $global.jstree.reference($el);
        const node = jstree.get_node(this);
        
        if ($global(e.target).closest('.jstree-ocl').length > 0) {
          return;
        }
        
        if (node.children && node.children.length > 0) {
          jstree.toggle_node(node);
        }
        
        jstree.select_node(node);
        
        e.preventDefault();
        return false;
      });

      setTimeout(() => {
        const inst = $el.jstree(true);
        const nodesToOpen = Array.isArray(openNodeIdsRef.current) ? openNodeIdsRef.current : [];
        const selectedNodeId = selectedNodeIdRef.current;
        
        if (nodesToOpen.length > 0) {
          const openNodesSequentially = (nodeIds, index = 0) => {
            if (index >= nodeIds.length) {
              if (selectedNodeId) {
                setTimeout(() => {
                  try {
                    const selectedData = inst.get_node(selectedNodeId);
                    if (selectedData && selectedData.data?.id) {
                      inst.select_node(selectedNodeId);
                      dispatch(getCostCenterDetails(selectedData.data.id));
                    }
                  } catch (e) {
                  }
                }, 100);
              }
              openNodeIdsRef.current = [];
              selectedNodeIdRef.current = null;
              return;
            }
            
            try {
              const nodeId = nodeIds[index];
              inst.open_node(nodeId, () => {
                openNodesSequentially(nodeIds, index + 1);
              });
            } catch (e) {
              openNodesSequentially(nodeIds, index + 1);
            }
          };
          
          openNodesSequentially(nodesToOpen);
        } else if (selectedNodeId) {
          try {
            inst.select_node(selectedNodeId);
          } catch {}
          openNodeIdsRef.current = [];
          selectedNodeIdRef.current = null;
        } else {
          openNodeIdsRef.current = [];
          selectedNodeIdRef.current = null;
        }
      }, 300);
    });

    $el.on('select_node.jstree', function (e, data) {
      let nodeData = null;
      const liAttr = data.node.li_attr || {};
      
      if (liAttr['data-node-data']) {
        nodeData = JSON.parse(liAttr['data-node-data']);
      } else if (data.node.original && data.node.original.data) {
        nodeData = data.node.original.data;
      } else if (data.node.data) {
        nodeData = data.node.data;
      }
      
      if (nodeData && nodeData.id) {
        setSelectedNode(nodeData);
        dispatch(getCostCenterDetails(nodeData.id));
      }
    });

    $el.on('contextmenu', '.jstree-anchor', function(e) {
      e.preventDefault();
      const jstree = $global.jstree.reference($el);
      const node = jstree.get_node(this);

      let nodeData = null;
      const liAttr = node.li_attr || {};

      if (liAttr['data-node-data']) {
        nodeData = JSON.parse(liAttr['data-node-data']);
      } else if (node.original && node.original.data) {
        nodeData = node.original.data;
      } else if (node.data) {
        nodeData = node.data;
      }

      if (nodeData && nodeData.id) {
        jstree.select_node(node);
        setContextMenu({
          visible: true,
          x: e.pageX,
          y: e.pageY,
          node: nodeData
        });
      }
    });

    $el.on('contextmenu', '.jstree-icon, .jstree-ocl', function(e) {
      e.preventDefault();
      const $targetAnchor = $global(e.currentTarget).closest('li').children('a.jstree-anchor');
      if ($targetAnchor && $targetAnchor.length) {
        $targetAnchor.trigger({ type: 'contextmenu', pageX: e.pageX, pageY: e.pageY, preventDefault: () => {} });
      }
    });

    return () => {
      try { $el.jstree('destroy'); } catch {}
    };
  }, [costCentersTree, dispatch, libsLoaded]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, node: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div className="accounts-tree-container">
      <div className="tree-header">
        <h1 className="tree-title">مراكز التكلفة</h1>
      </div>

      <div className="tree-content">
        <div className="tree-view">
          {isLoading && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'rgba(240, 244, 250, 0.9)'
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--main-color)',
                borderTopColor: 'transparent', display: 'inline-block',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
          <div id="cost-centers-tree" ref={treeContainerRef} />
        </div>

        <div className="tree-details">
          <div className="details-content">
            {costCenterDetails ? (() => {
              const details = costCenterDetails.data || costCenterDetails;
              return (
                <div>
                <div style={{ 
                  background: 'var(--basic-color)',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: '#182d40', marginBottom: '0.75rem', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الإجراءات</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setModalMode('add');
                        setShowModal(true);
                        setPendingAction('add');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--main-color)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 106, 255, 0.2)',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}
                    >
                      إضافة
                    </button>
                    <button
                      onClick={() => {
                        setModalMode('edit');
                        setShowModal(true);
                        setPendingAction('edit');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--gray-color)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--red-color)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => {
                        setPendingAction('toggle');
                        dispatch(toggleCostCenterStatus(details.id));
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: details.is_active ? 'var(--chart-color-2)' : 'var(--main-color)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 106, 255, 0.2)',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}
                    >
                      {details.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                    </button>
                  </div>
                </div>

                <h3 style={{ color: '#182d40', marginBottom: '1rem', fontSize: '16px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل مركز التكلفة</h3>
                <div style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                  <p style={{ fontWeight: 'bold' }}><strong>الاسم:</strong> {details.name_ar || details.name}</p>
                  <p style={{ fontWeight: 'bold' }}><strong>الاسم بالإنجليزية:</strong> {details.name_en || 'غير متوفر'}</p>
                  <p style={{ fontWeight: 'bold' }}><strong>الكود:</strong> {details.code || 'غير متوفر'}</p>
                  <p style={{ fontWeight: 'bold' }}><strong>الحالة:</strong> {details.is_active ? 'نشط' : 'غير نشط'}</p>
                  {details.parent && <p style={{ fontWeight: 'bold' }}><strong>المركز الأب:</strong> {details.parent.name_ar || details.parent.name}</p>}
                  {details.created_at && <p style={{ fontWeight: 'bold' }}><strong>تاريخ الإنشاء:</strong> {new Date(details.created_at).toLocaleDateString('ar-EG')}</p>}
                </div>
              </div>
              );
            })() : (
              <p style={{ color: '#182d40', margin: 0, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                اختر عنصرًا من الشجرة لعرض التفاصيل
              </p>
            )}
          </div>
        </div>
      </div>

      <CostCenterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        parentCostCenter={modalMode === 'add' ? (costCenterDetails?.data || costCenterDetails) : null}
        costCenterData={modalMode === 'edit' ? (costCenterDetails?.data || costCenterDetails) : null}
        onSuccess={() => {
          dispatch(getCostCentersTree());
          if (costCenterDetails) {
            const details = costCenterDetails.data || costCenterDetails;
            dispatch(getCostCenterDetails(details.id));
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          const details = costCenterDetails?.data || costCenterDetails;
          if (details?.id) {
            setPendingAction('delete');
            dispatch(deleteCostCenter(details.id));
            setShowDeleteConfirm(false);
          }
        }}
        accountName={(costCenterDetails?.data || costCenterDetails)?.name_ar || (costCenterDetails?.data || costCenterDetails)?.name || 'مركز التكلفة'}
      />

      {contextMenu.visible && contextMenu.node && (
        <div 
          className="context-menu accounts-tree-context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 25000,
            backgroundColor: 'var(--basic-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '4px',
            minWidth: '180px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="context-menu-item"
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: '#182d40',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(0, 106, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setModalMode('add');
              setShowModal(true);
              setPendingAction('add');
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getCostCenterDetails(contextMenu.node.id));
            }}
          >
            إضافة
          </button>
          <button 
            className="context-menu-item"
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: '#182d40',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(0, 106, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setModalMode('edit');
              setShowModal(true);
              setPendingAction('edit');
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getCostCenterDetails(contextMenu.node.id));
            }}
          >
            تعديل
          </button>
          <button 
            className="context-menu-item danger"
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setShowDeleteConfirm(true);
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getCostCenterDetails(contextMenu.node.id));
            }}
          >
            حذف
          </button>
          <button 
            className="context-menu-item warning"
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              color: '#f59e0b',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(245, 158, 11, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setPendingAction('toggle');
              dispatch(toggleCostCenterStatus(contextMenu.node.id));
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getCostCenterDetails(contextMenu.node.id));
            }}
          >
            {contextMenu.node.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CostCentersTree;
