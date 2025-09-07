import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, notification, Skeleton } from "antd";
import { UserOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { getUserCount, getUserStat } from "../../services/user.service";
import { getPaymentCount, getPaymentStat } from "../../services/payment.service";
import { getDonneesCount } from "../../services/donnees.service";
import "./home.scss";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    payments: 0,
    donnees: 0,
    paymentsData: [],
    usersData: [],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, paymentsRes, donneesRes, paymentsGraphRes, usersGraphRes] =
        await Promise.all([
          getUserCount(),
          getPaymentCount(),
          getDonneesCount(),
          getPaymentStat(),
          getUserStat(),
        ]);

      setStats({
        users: usersRes.data.count,
        payments: paymentsRes.data.count,
        donnees: donneesRes.data.count,
        paymentsData: paymentsGraphRes.data || [],
        usersData: usersGraphRes.data || [],
      });
    } catch (err) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les statistiques",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <Spin size="large" tip="Chargement des statistiques..." />
      </div>
    );

  return (
    <div className="home-dashboard">
      {/* Statistiques rapides */}
      <Row gutter={[24, 24]}>
        {[
          {
            title: "Utilisateurs",
            value: stats.users,
            icon: <UserOutlined />,
            gradient: "linear-gradient(135deg, #1890ff, #70cfff)",
          },
          {
            title: "Paiements",
            value: stats.payments,
            icon: <DollarOutlined />,
            gradient: "linear-gradient(135deg, #52c41a, #9be37a)",
          },
          {
            title: "Données",
            value: stats.donnees,
            icon: <FileTextOutlined />,
            gradient: "linear-gradient(135deg, #faad14, #ffd666)",
          },
        ].map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ background: stat.gradient }}>
                {stat.icon}
              </div>
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Graphiques */}
      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        <Col xs={24} md={12}>
          <Card className="chart-card">
            <h3>📊 Montant des paiements par mois</h3>
            {stats.paymentsData.length ? (
              <div className="chart-container">
                <ResponsiveBar
                  data={stats.paymentsData}
                  keys={["amount"]}
                  indexBy="month"
                  margin={{ top: 30, right: 30, bottom: 60, left: 70 }}
                  padding={0.25}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={(d) =>
                    d.value > 500 ? "#52c41a" : "#1890ff"
                  }
                  borderRadius={6}
                  axisBottom={{
                    tickRotation: -25,
                    legend: "Mois",
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    legend: "Montant ($)",
                    legendPosition: "middle",
                    legendOffset: -50,
                    format: (v) => `$${v}`,
                  }}
                  enableGridY
                  enableLabel={false}
                  tooltip={({ indexValue, value }) => (
                    <div className="tooltip-box">
                      <strong>{indexValue}</strong>
                      <br />💵 {value} $
                    </div>
                  )}
                  theme={{
                    axis: {
                      ticks: { text: { fontSize: 12, fill: "#666" } },
                      legend: { text: { fontSize: 14, fill: "#222" } },
                    },
                  }}
                  motionConfig="wobbly"
                />
              </div>
            ) : (
              <Skeleton active paragraph={{ rows: 6 }} />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="chart-card">
            <h3>👥 Nouveaux utilisateurs par mois</h3>
            {stats.usersData.length ? (
              <div className="chart-container">
                <ResponsiveLine
                  data={[
                    {
                      id: "Utilisateurs",
                      data: stats.usersData.map((d) => ({
                        x: d.month,
                        y: d.users,
                      })),
                    },
                  ]}
                  margin={{ top: 30, right: 30, bottom: 60, left: 70 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: 0, max: "auto" }}
                  axisBottom={{
                    tickRotation: -25,
                    legend: "Mois",
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    legend: "Utilisateurs",
                    legendPosition: "middle",
                    legendOffset: -50,
                  }}
                  curve="monotoneX"
                  colors={["url(#line-gradient)"]}
                  pointSize={10}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  enableArea
                  areaOpacity={0.25}
                  useMesh
                  enableSlices="x"
                  tooltip={({ point }) => (
                    <div className="tooltip-box">
                      📅 {point.data.xFormatted}
                      <br />👤 {point.data.yFormatted} utilisateurs
                    </div>
                  )}
                  defs={[
                    {
                      id: "line-gradient",
                      type: "linearGradient",
                      colors: [
                        { offset: 0, color: "#1890ff" },
                        { offset: 100, color: "#70cfff" },
                      ],
                    },
                  ]}
                  theme={{
                    axis: {
                      ticks: { text: { fontSize: 12, fill: "#666" } },
                      legend: { text: { fontSize: 14, fill: "#222" } },
                    },
                  }}
                  motionConfig="gentle"
                />
              </div>
            ) : (
              <Skeleton active paragraph={{ rows: 6 }} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
