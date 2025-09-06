import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, notification, Skeleton } from "antd";
import { UserOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import "./home.scss";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    payments: 0,
    donnees: 0,
    paymentsData: [],
    usersData: []
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, paymentsRes, donneesRes, paymentsGraphRes, usersGraphRes] = await Promise.all([
        axios.get("/api/utilisateurs/count"),
        axios.get("/api/payments/count"),
        axios.get("/api/donnees/count"),
        axios.get("/api/payments/graph"),
        axios.get("/api/utilisateurs/graph")
      ]);

      setStats({
        users: usersRes.data.count,
        payments: paymentsRes.data.count,
        donnees: donneesRes.data.count,
        paymentsData: paymentsGraphRes.data || [],
        usersData: usersGraphRes.data || []
      });
    } catch (err) {
      notification.error({ message: "Erreur", description: "Impossible de charger les statistiques" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" tip="Chargement des statistiques..." />
      </div>
    );

  return (
    <div className="home-dashboard" style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {[
          { title: "Utilisateurs", value: stats.users, icon: <UserOutlined style={{ color: "#1890ff" }} />, color: "#e6f7ff" },
          { title: "Paiements", value: stats.payments, icon: <DollarOutlined style={{ color: "#52c41a" }} />, color: "#f6ffed" },
          { title: "Données", value: stats.donnees, icon: <FileTextOutlined style={{ color: "#faad14" }} />, color: "#fffbe6" },
        ].map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              className="stat-card"
              hoverable
              style={{ borderRadius: 12, transition: "all 0.3s", background: stat.color }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        <Col xs={24} md={12}>
          <Card className="chart-card" style={{ borderRadius: 12, minHeight: 400 }}>
            <h3>Montant des paiements par mois</h3>
            {stats.paymentsData.length ? (
              <ResponsiveBar
                data={stats.paymentsData}
                keys={['amount']}
                indexBy="month"
                margin={{ top: 30, right: 30, bottom: 70, left: 70 }}
                padding={0.4}
                colors={{ scheme: 'set2' }}
                borderRadius={6}
                axisBottom={{
                  tickRotation: -45,
                  legend: 'Mois',
                  legendPosition: 'middle',
                  legendOffset: 50
                }}
                axisLeft={{
                  legend: 'Montant ($)',
                  legendPosition: 'middle',
                  legendOffset: -60
                }}
                enableGridY={true}
                animate
                motionStiffness={90}
                motionDamping={15}
              />
            ) : <Skeleton active paragraph={{ rows: 6 }} />}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="chart-card" style={{ borderRadius: 12, minHeight: 400 }}>
            <h3>Nouvel utilisateur par mois</h3>
            {stats.usersData.length ? (
              <ResponsiveLine
                data={[{ id: 'Utilisateurs', data: stats.usersData.map(d => ({ x: d.month, y: d.users })) }]}
                margin={{ top: 30, right: 30, bottom: 70, left: 70 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0 }}
                curve="monotoneX"
                axisBottom={{
                  tickRotation: -45,
                  legend: 'Mois',
                  legendPosition: 'middle',
                  legendOffset: 50
                }}
                axisLeft={{
                  legend: 'Utilisateurs',
                  legendPosition: 'middle',
                  legendOffset: -60
                }}
                colors={{ scheme: 'nivo' }}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={true}
                animate
              />
            ) : <Skeleton active paragraph={{ rows: 6 }} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
