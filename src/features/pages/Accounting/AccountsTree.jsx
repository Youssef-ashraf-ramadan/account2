import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAccountsTree, getAccountDetails, deleteAccount, toggleAccountStatus, clearError, clearSuccess, clearAccountDetails } from '../../../redux/Slices/authSlice';
import AccountModal from './AccountModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toast } from 'react-toastify';
import './AccountsTree.css';

const JSTREE_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.17/themes/default/style.min.css';
const JQUERY_JS = 'https://code.jquery.com/jquery-3.7.1.min.js';
const JSTREE_JS = 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.17/jstree.min.js';

function loadOnce(tagName, id, attributes = {}) {
  if (document.getElementById(id)) {
    // If already exists, check if it's loaded
    if (tagName === 'script') {
      // For scripts, check if the library is available
      if (id === 'jquery-js' && (window.jQuery || window.$)) {
        return Promise.resolve();
      }
      if (id === 'jstree-js' && window.jQuery && window.jQuery.fn && window.jQuery.fn.jstree) {
        return Promise.resolve();
      }
      // If script exists but not loaded yet, wait a bit and check again
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
          resolve(); // Resolve anyway after timeout to avoid infinite waiting
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
        // Extra check for scripts
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

const AccountsTree = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { accountsTree, accountDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [pendingAction, setPendingAction] = useState(null); // 'toggle' | 'add' | 'edit' | 'delete' | null
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

  // Load libs once
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        await loadOnce('link', 'jstree-css', { rel: 'stylesheet', href: JSTREE_CSS });
        await loadOnce('script', 'jquery-js', { src: JQUERY_JS });
        
        // Wait for jQuery to be available
        let attempts = 0;
        while (!(window.jQuery || window.$) && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        await loadOnce('script', 'jstree-js', { src: JSTREE_JS });
        
        // Wait for jsTree to be available
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
    dispatch(getAccountsTree());
    dispatch(clearAccountDetails());
    setSelectedNode(null);
  }, [dispatch, location.pathname]);

  // Clear details when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAccountDetails());
    };
  }, [dispatch]);

  // Handle errors with deduplication (avoid duplicate toasts)
  useEffect(() => {
    if (!error || !pendingAction) return;
    if (pendingAction === 'toggle' || pendingAction === 'delete') {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      } else {
      }
    }
    const timer = setTimeout(() => {
      dispatch(clearError());
      setPendingAction(null);
    }, 100);
    return () => clearTimeout(timer);
  }, [error, pendingAction, dispatch]);

  // Handle success and decide whether to refresh tree
  useEffect(() => {
    if (!success) return;
    // Show toast only for actions outside the modal (toggle / delete)
    if (pendingAction === 'toggle' || pendingAction === 'delete') {
      toast.success(success, { rtl: true });
    }

    // For add/edit/delete we refresh the whole tree to reflect structure changes
    if (pendingAction === 'add' || pendingAction === 'edit' || pendingAction === 'delete' || showModal) {
      // snapshot currently open nodes and selection to restore after refresh
      const inst = getJsTreeInstance();
      if (inst) {
        try {
          openNodeIdsRef.current = inst.get_open_nodes ? inst.get_open_nodes() : [];
          const sel = inst.get_selected ? inst.get_selected() : [];
          // Don't save selected node for delete action - the node will be gone
          selectedNodeIdRef.current = (sel && sel.length > 0 && pendingAction !== 'delete') ? sel[0] : null;
        } catch {}
      }
      
      // For delete action, clear the selected account details immediately
      if (pendingAction === 'delete') {
        dispatch({ type: 'auth/clearAccountDetails' });
      }
      
      dispatch(getAccountsTree());
      setShowModal(false);
    } else if (pendingAction === 'toggle' && accountDetails?.id) {
      // For toggle, just refresh details to avoid collapsing open nodes
      dispatch(getAccountDetails(accountDetails.id));
    }

    setPendingAction(null);
    dispatch(clearSuccess());
  }, [success, pendingAction, showModal, accountDetails, dispatch]);

  // Flatten the nested structure to jsTree format
  const flattenTree = (nodes, allNodes = []) => {
    if (!nodes || !Array.isArray(nodes)) return allNodes;
    
    nodes.forEach(node => {
      // Determine icon type based on whether node can have children
      let iconType = 'default';
      if (node.children && node.children.length > 0) {
        iconType = 'default'; // folder icon for nodes with children
      } else if (node.can_have_children) {
        iconType = 'default'; // folder icon for expandable empty folders
      } else {
        iconType = 'file'; // file icon for leaf nodes
      }
      
      allNodes.push({
        id: String(node.id),
        parent: node.parent_id ? String(node.parent_id) : '#',
        text: node.name_ar || node.name || `العنصر ${node.id}`,
        type: iconType,
        data: node, // store full data for details
        li_attr: { 
          'data-can-have-children': node.can_have_children ? 'true' : 'false',
          'data-category': node.category || 'normal',
          'data-node-data': JSON.stringify(node)
        }
      });
      
      // Recursively process children
      if (node.children && node.children.length > 0) {
        flattenTree(node.children, allNodes);
      }
    });
    
    return allNodes;
  };

  // Initialize jsTree whenever data is available
  useEffect(() => {
    if (!libsLoaded) return;
    
    const $global = window.jQuery || window.$;
    if (!$global || !treeContainerRef.current) return;
    if (!accountsTree || accountsTree.length === 0) return;
    
    // Check if jsTree plugin is available
    if (!$global.fn || !$global.fn.jstree) {
      console.warn('jsTree plugin not loaded yet');
      return;
    }

    const $el = $global(treeContainerRef.current);
    // Destroy previous instance if exists
    try { $el.jstree('destroy'); } catch {}

    const jsTreeData = flattenTree(accountsTree);

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
          valid_children: ['default', 'file']
        },
        file: { 
          icon: 'jstree-file',
          valid_children: []
        }
      }
    });

    // Make entire row clickable to expand/collapse - but arrow stays in place
    $el.on('ready.jstree', function() {
      // Only toggle on the anchor, not the ocl
      $el.jstree(true).get_container().delegate('a.jstree-anchor', 'click', function(e) {
        const jstree = $global.jstree.reference($el);
        const node = jstree.get_node(this);
        
        // Don't prevent default on arrow clicks, just on text area
        if ($global(e.target).closest('.jstree-ocl').length > 0) {
          return; // Let default arrow behavior work
        }
        
        // If node has children, toggle it
        if (node.children && node.children.length > 0) {
          jstree.toggle_node(node);
        }
        
        // Select the node to trigger details
        jstree.select_node(node);
        
        e.preventDefault();
        return false;
      });

      // Restore previously open nodes and selection if any
      setTimeout(() => {
        const inst = $el.jstree(true);
        const nodesToOpen = Array.isArray(openNodeIdsRef.current) ? openNodeIdsRef.current : [];
        const selectedNodeId = selectedNodeIdRef.current;
        
        if (nodesToOpen.length > 0) {
          // Open nodes sequentially to ensure parent nodes are opened first
          const openNodesSequentially = (nodeIds, index = 0) => {
            if (index >= nodeIds.length) {
              // All nodes opened, now select the node if needed
              if (selectedNodeId) {
                setTimeout(() => {
                  try {
                    const selectedData = inst.get_node(selectedNodeId);
                    if (selectedData && selectedData.data?.id) {
                      inst.select_node(selectedNodeId);
                      dispatch(getAccountDetails(selectedData.data.id));
                    }
                  } catch (e) {
                  }
                }, 100);
              }
              // Clear snapshots after everything is done
              openNodeIdsRef.current = [];
              selectedNodeIdRef.current = null;
              return;
            }
            
            try {
              const nodeId = nodeIds[index];
              inst.open_node(nodeId, () => {
                // Callback when node is opened, open next one
                openNodesSequentially(nodeIds, index + 1);
              });
            } catch (e) {
              openNodesSequentially(nodeIds, index + 1);
            }
          };
          
          openNodesSequentially(nodesToOpen);
        } else if (selectedNodeId) {
          // No nodes to open, just select the node
          try {
            inst.select_node(selectedNodeId);
          } catch {}
          openNodeIdsRef.current = [];
          selectedNodeIdRef.current = null;
        } else {
          // No nodes to open or select, clear snapshots
          openNodeIdsRef.current = [];
          selectedNodeIdRef.current = null;
        }
      }, 300);
    });

    // Handle node selection for displaying details
    $el.on('select_node.jstree', function (e, data) {
      
      // Try to get data from various possible locations
      let nodeData = null;
      const liAttr = data.node.li_attr || {};
      
      // Check if data is stored in li_attr
      if (liAttr['data-node-data']) {
        nodeData = JSON.parse(liAttr['data-node-data']);
      } else if (data.node.original && data.node.original.data) {
        nodeData = data.node.original.data;
      } else if (data.node.data) {
        nodeData = data.node.data;
      }
      
      
      if (nodeData && nodeData.id) {
        setSelectedNode(nodeData);
        dispatch(getAccountDetails(nodeData.id));
      } else {
      }
    });

    // Handle context menu (right click) on anchors
    $el.on('contextmenu', '.jstree-anchor', function(e) {
      e.preventDefault();
      const jstree = $global.jstree.reference($el);
      const node = jstree.get_node(this);

      // Get node data
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
        // Select the node first
        jstree.select_node(node);
        // Show context menu
        setContextMenu({
          visible: true,
          x: e.pageX,
          y: e.pageY,
          node: nodeData
        });
      }
    });

    // Also support right click on icon/arrow by delegating to closest anchor
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
  }, [accountsTree, dispatch, libsLoaded]);

  // Hide context menu on outside click
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
        <h1 className="tree-title">الشجرة المحاسبية</h1>
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
          <div id="accounts-tree" ref={treeContainerRef} />
        </div>

        <div className="tree-details">
          <div className="details-content">
            {accountDetails ? (
              <div>
                {/* Action Buttons */}
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
                      onMouseEnter={(e) => e.target.style.background = 'var(--sub-light)'}
                      onMouseLeave={(e) => e.target.style.background = 'var(--main-color)'}
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
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
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
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      حذف
                    </button>
                  <button
                      onClick={() => {
                      setPendingAction('toggle');
                      dispatch(toggleAccountStatus(accountDetails.id));
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: accountDetails.is_active ? 'var(--chart-color-2)' : 'var(--main-color)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: accountDetails.is_active ? '0 2px 4px rgba(51, 133, 255, 0.2)' : '0 2px 4px rgba(0, 106, 255, 0.2)',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      {accountDetails.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                    </button>
                  </div>
                </div>

                <h3 style={{ color: '#182d40', marginBottom: '1rem', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تفاصيل الحساب</h3>
                <div style={{ color: '#182d40' }}>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الاسم:</strong> {accountDetails.name_ar || accountDetails.name}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الاسم بالإنجليزية:</strong> {accountDetails.name_en || 'غير متوفر'}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الكود:</strong> {accountDetails.code || 'غير متوفر'}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>النوع:</strong> {accountDetails.type || 'غير محدد'}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الفئة:</strong> {accountDetails.category || 'غير محدد'}</p>
                  <p><strong>حساب قيد:</strong> {accountDetails.is_posting_account ? 'বাদ' : 'لا'}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>يمكن أن يكون له أبناء:</strong> {accountDetails.can_have_children ? 'نعم' : 'لا'}</p>
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الحالة:</strong> {accountDetails.is_active ? 'نشط' : 'غير نشط'}</p>
                  {accountDetails.parent && <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>الحساب الأب:</strong> {accountDetails.parent.name_ar || accountDetails.parent.name}</p>}
                  {accountDetails.created_at && <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '0.5rem' }}><strong style={{ opacity: 0.7 }}>تاريخ الإنشاء:</strong> {new Date(accountDetails.created_at).toLocaleDateString('ar-EG')}</p>}
                </div>
              </div>
            ) : (
              <p style={{ color: '#182d40', margin: 0, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                اختر عنصرًا من الشجرة لعرض التفاصيل
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        parentAccount={modalMode === 'add' ? accountDetails : null}
        accountData={modalMode === 'edit' ? accountDetails : null}
        onSuccess={() => {
          dispatch(getAccountsTree());
          if (accountDetails) {
            dispatch(getAccountDetails(accountDetails.id));
          }
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (accountDetails?.id) {
            setPendingAction('delete');
            dispatch(deleteAccount(accountDetails.id));
            setShowDeleteConfirm(false);
          }
        }}
        accountName={accountDetails?.name_ar || accountDetails?.name}
      />

      {/* Context Menu */}
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
            boxShadow: '0 10px 25px rgba(0, 106, 255, 0.1)',
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
              dispatch(getAccountDetails(contextMenu.node.id));
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
              dispatch(getAccountDetails(contextMenu.node.id));
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
              color: 'var(--red-color)',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(220, 53, 69, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setShowDeleteConfirm(true);
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getAccountDetails(contextMenu.node.id));
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
              color: 'var(--chart-color-2)',
              textAlign: 'right',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'all 0.2s',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(51, 133, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              setPendingAction('toggle');
              dispatch(toggleAccountStatus(contextMenu.node.id));
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              dispatch(getAccountDetails(contextMenu.node.id));
            }}
          >
            {contextMenu.node.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountsTree;
