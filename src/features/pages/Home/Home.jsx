import React, { useEffect } from "react";
import { useTitle } from "../../../shared/hooks/TitleContext";
import {
  FaUsers,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartPie,
  FaChartBar,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";
import "./home.css";

const Home = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("لوحة التحكم");
  }, [setTitle]);

  const statsData = [
    {
      icon: <FaUsers />,
      number: "150",
      title: "إجمالي الموظفين",
      change: "أكثر بـ 8 موظفين عن الشهر السابق",
      color: "var(--main-color)",
      bgColor: "rgba(0, 106, 255, 0.12)",
      trend: "up"
    },
    {
      icon: <FaClock />,
      number: "95%",
      title: "معدل الحضور",
      change: "أكثر بنسبة 2.1% عن الشهر السابق",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.12)",
      trend: "up"
    },
    {
      icon: <FaMoneyBillWave />,
      number: "45",
      title: "طلبات المرتبات",
      change: "أكثر بـ 3 طلبات عن الشهر السابق",
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.12)",
      trend: "up"
    },
    {
      icon: <FaCalendarAlt />,
      number: "12",
      title: "طلبات الإجازات",
      change: "أقل بـ 2 طلب عن الشهر السابق",
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.15)",
      trend: "down"
    }
  ];

  const attendanceData = {
    total: 150,
    present: 142,
    absent: 8,
    late: 12
  };

  const chartData = [
    { name: "حاضر", value: 142, color: "var(--main-color)" },
    { name: "متأخر", value: 12, color: "var(--chart-color-2)" },
    { name: "غائب", value: 8, color: "var(--chart-color-3)" }
  ];

  const barChartData = [
    { name: "يناير", employees: 150, attendance: 142 },
    { name: "فبراير", employees: 155, attendance: 148 },
    { name: "مارس", employees: 160, attendance: 152 },
    { name: "أبريل", employees: 158, attendance: 150 },
    { name: "مايو", employees: 165, attendance: 158 },
    { name: "يونيو", employees: 162, attendance: 155 }
  ];

  const lineChartData = [
    { name: "يناير", salaries: 45000, expenses: 38000 },
    { name: "فبراير", salaries: 48000, expenses: 40000 },
    { name: "مارس", salaries: 50000, expenses: 42000 },
    { name: "أبريل", salaries: 49000, expenses: 41000 },
    { name: "مايو", salaries: 52000, expenses: 44000 },
    { name: "يونيو", salaries: 51000, expenses: 43000 }
  ];

  const areaChartData = [
    { name: "يناير", revenue: 120000, profit: 80000 },
    { name: "فبراير", revenue: 125000, profit: 85000 },
    { name: "مارس", revenue: 130000, profit: 88000 },
    { name: "أبريل", revenue: 128000, profit: 87000 },
    { name: "مايو", revenue: 135000, profit: 91000 },
    { name: "يونيو", revenue: 132000, profit: 89000 }
  ];

  const formatNumber = (value) => new Intl.NumberFormat("ar-EG").format(value);
  const formatCurrency = (value) => `${new Intl.NumberFormat("ar-EG").format(value)} جنيه`;
  const formatDelta = (value) => {
    if (value === 0) {
      return "بدون تغيير";
    }
    const sign = value > 0 ? "+" : "-";
    return `${sign}${new Intl.NumberFormat("ar-EG").format(Math.abs(value))} جنيه`;
  };

  const averageEmployees = barChartData.length
    ? Math.round(barChartData.reduce((sum, item) => sum + item.employees, 0) / barChartData.length)
    : 0;

  const averageAttendance = barChartData.length
    ? Math.round(barChartData.reduce((sum, item) => sum + item.attendance, 0) / barChartData.length)
    : 0;

  const attendancePercentage = attendanceData.total
    ? Math.round((attendanceData.present / attendanceData.total) * 100)
    : 0;

  const attendanceTrendData = barChartData.map((item) => {
    const rate = item.employees ? Math.round((item.attendance / item.employees) * 100) : 0;
    return {
      ...item,
      attendanceRate: rate,
    };
  });

  const averageAttendanceRate = attendanceTrendData.length
    ? Math.round(
        attendanceTrendData.reduce((sum, item) => sum + (item.attendanceRate || 0), 0) /
          attendanceTrendData.length
      )
    : 0;

  const peakAttendanceMonth = attendanceTrendData.length
    ? attendanceTrendData.reduce((highest, current) =>
        current.attendanceRate > highest.attendanceRate ? current : highest
      )
    : { name: "-", attendanceRate: 0 };

  const latestMonth = lineChartData[lineChartData.length - 1] || {
    name: "-",
    salaries: 0,
    expenses: 0
  };

  const previousMonth = lineChartData.length > 1
    ? lineChartData[lineChartData.length - 2]
    : latestMonth;

  const salariesDelta = latestMonth.salaries - previousMonth.salaries;
  const expensesDelta = latestMonth.expenses - previousMonth.expenses;

  const totalRevenue = areaChartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = areaChartData.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="main_content dashboard-background">
      <div className="dashboard-container">

        <section className="charts-grid">
          <article className="dashboard-card">
            <div className="card-heading">
              <span className="card-heading__icon">
                <FaChartPie />
              </span>
              <div>
                <h2 className="card-title">نسبة الحضور</h2>
                <p className="card-subtitle">متابعة لحظية لحالات الحضور، التأخير، والغياب.</p>
              </div>
            </div>
            <div className="chart-container chart-container--medium">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      borderRadius: 12,
                      borderColor: "var(--border-color)",
                      backgroundColor: "#ffffff",
                      color: "#182d40",
                      boxShadow: "0 12px 24px rgba(24, 45, 64, 0.08)"
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      color: "#182d40"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-summary">
              <div className="chart-pill chart-pill--accent">
                <span>نسبة الحضور</span>
                <strong>{attendancePercentage}%</strong>
              </div>
              <div className="chart-badges">
                {chartData.map((item) => (
                  <div className="chart-badge" key={item.name}>
                    <span
                      className="chart-badge__dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="chart-badge__info">
                      <span className="chart-badge__label">{item.name}</span>
                      <span className="chart-badge__value">{formatNumber(item.value)} موظف</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-heading">
              <span className="card-heading__icon">
                <FaChartBar />
              </span>
              <div>
                <h2 className="card-title">الموظفون والحضور الشهري</h2>
                <p className="card-subtitle">تطور عدد الموظفين مقابل الحضور خلال نصف عام.</p>
              </div>
            </div>
            <div className="chart-container chart-container--tall">
               <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={attendanceTrendData}>
                  <defs>
                    <linearGradient id="employeesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <Tooltip
                    labelFormatter={(label) => `الشهر: ${label}`}
                    formatter={(value, name, { dataKey }) => {
                      if (dataKey === 'attendanceRate') {
                        return [`${value}%`, 'نسبة الحضور']
                      }
                      return [`${formatNumber(value)} موظف`, 'عدد الموظفين']
                    }}
                    contentStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      borderRadius: 12,
                      borderColor: "var(--border-color)",
                      backgroundColor: "#ffffff",
                      color: "#182d40",
                      boxShadow: "0 12px 24px rgba(24, 45, 64, 0.08)"
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      color: "#182d40"
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="employees"
                    name="عدد الموظفين"
                    stroke="var(--main-color)"
                    strokeWidth={2.5}
                    fill="url(#employeesGradient)"
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendanceRate"
                    name="نسبة الحضور"
                    stroke="#FF7A00"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
               </ResponsiveContainer>
            </div>
            <div className="chart-summary chart-summary--inline">
              <div className="chart-pill chart-pill--accent">
                <span>متوسط الموظفين</span>
                <strong>{formatNumber(averageEmployees)}</strong>
              </div>
              <div className="chart-pill chart-pill--positive">
                <span>متوسط نسبة الحضور</span>
                <strong>{averageAttendanceRate}%</strong>
              </div>
              <div className="chart-pill chart-pill--accent">
                <span>أعلى نسبة حضور</span>
                <strong>{peakAttendanceMonth.attendanceRate}% • {peakAttendanceMonth.name}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="charts-grid">
          <article className="dashboard-card">
            <div className="card-heading">
              <span className="card-heading__icon">
                <FaChartLine />
              </span>
              <div>
                <h2 className="card-title">المرتبات والمصروفات</h2>
                <p className="card-subtitle">مقارنة شهرية بين إجمالي المرتبات والمصروفات التشغيلية.</p>
              </div>
            </div>
            <div className="chart-container chart-container--tall">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      borderRadius: 12,
                      borderColor: "var(--border-color)",
                      backgroundColor: "#ffffff",
                      color: "#182d40",
                      boxShadow: "0 12px 24px rgba(24, 45, 64, 0.08)"
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      color: "#182d40"
                    }}
                  />
                  <Line type="monotone" dataKey="salaries" stroke="var(--main-color)" strokeWidth={3} name="المرتبات" dot={false} />
                  <Line type="monotone" dataKey="expenses" stroke="var(--chart-color-2)" strokeWidth={3} name="المصروفات" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-summary chart-summary--inline chart-summary--stacked">
              <div className="chart-pill chart-pill--accent">
                <span>آخر شهر: {latestMonth.name}</span>
                <strong>{formatCurrency(latestMonth.salaries)}</strong>
              </div>
              <div className={`chart-pill ${salariesDelta >= 0 ? "chart-pill--positive" : "chart-pill--negative"}`}>
                <span>تغير المرتبات</span>
                <strong>{formatDelta(salariesDelta)}</strong>
              </div>
              <div className={`chart-pill ${expensesDelta >= 0 ? "chart-pill--positive" : "chart-pill--negative"}`}>
                <span>تغير المصروفات</span>
                <strong>{formatDelta(expensesDelta)}</strong>
              </div>
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-heading">
              <span className="card-heading__icon">
                <FaMoneyBillWave />
              </span>
              <div>
                <h2 className="card-title">الإيرادات والأرباح</h2>
                <p className="card-subtitle">رصد الأداء المالي عبر تتبع الإيرادات وصافي الربح شهرياً.</p>
              </div>
            </div>
            <div className="chart-container chart-container--tall">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-color-2)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-color-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#182d40", fontFamily: "Droid Arabic Kufi Bold, sans-serif", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      borderRadius: 12,
                      borderColor: "var(--border-color)",
                      backgroundColor: "#ffffff",
                      color: "#182d40",
                      boxShadow: "0 12px 24px rgba(24, 45, 64, 0.08)"
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontFamily: "Droid Arabic Kufi Bold, sans-serif",
                      color: "#182d40"
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--main-color)" fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                  <Area type="monotone" dataKey="profit" stroke="var(--chart-color-2)" fillOpacity={1} fill="url(#colorProfit)" name="الأرباح" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-summary chart-summary--inline">
              <div className="chart-pill chart-pill--accent">
                <span>إجمالي الإيرادات</span>
                <strong>{formatCurrency(totalRevenue)}</strong>
              </div>
              <div className="chart-pill chart-pill--positive">
                <span>إجمالي الأرباح</span>
                <strong>{formatCurrency(totalProfit)}</strong>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Home;
