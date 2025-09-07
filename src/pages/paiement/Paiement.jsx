import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Spin,
  Button,
  Modal,
  notification,
  Space,
  Tooltip,
  Typography,
  Card,
  Divider,
} from "antd";
import {
  EditOutlined,
  ReloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getPayment } from "../../services/payment.service";

const { Title, Text } = Typography;

const Paiement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  /** Charger les paiements **/
  const fetchPaiements = async () => {
    setLoading(true);
    try {
      const res = await getPayment();
      setData(res.data);
    } catch {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les paiements.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  /** Ouvrir modal **/
  const openModal = (record = null) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  /** Colonnes de la table **/
  const columns = [
    {
      title: "#",
      render: (_, __, index) => <Text strong>{index + 1}</Text>,
      width: 60,
      align: "center",
    },
    {
      title: "Utilisateur",
      dataIndex: "nom",
      key: "nom",
      render: (val) => <Text>{val}</Text>,
    },
    {
      title: "Abonnement",
      dataIndex: "name",
      key: "name",
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: "Montant",
      dataIndex: "amount",
      key: "amount",
      render: (val) => (
        <Space>
          <DollarOutlined style={{ color: "#52c41a" }} />
          <Text strong>${val.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: "Méthode",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (method) => (
        <Tag color="geekblue" style={{ borderRadius: 8 }}>
          {method}
        </Tag>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "Date paiement",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date) =>
        date ? moment(date).format("DD MMM YYYY HH:mm") : "—",
      sorter: (a, b) => moment(a.payment_date) - moment(b.payment_date),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "success"
            ? "green"
            : status === "failed"
            ? "red"
            : "orange";
        return (
          <Tag color={color} style={{ borderRadius: 8, padding: "0 10px" }}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: "Success", value: "success" },
        { text: "Failed", value: "failed" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Voir détails">
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      {/* Header */}
      <Space
        style={{
          marginBottom: 20,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            💳 Tableau des Paiements
          </Title>
          <Text type="secondary">
            Suivi des transactions financières et abonnements.
          </Text>
        </div>
        <Tooltip title="Rafraîchir">
          <Button
            type="default"
            shape="round"
            icon={<ReloadOutlined />}
            onClick={fetchPaiements}
          >
            Rafraîchir
          </Button>
        </Tooltip>
      </Space>

      <Divider style={{ margin: "12px 0 24px" }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_payments"
          bordered={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total: ${total} paiements`,
          }}
          scroll={{ x: "max-content" }}
          sticky
          size="middle"
        />
      )}

      {/* Modal détails paiement */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingRecord ? "Détails du paiement" : "Ajouter un paiement"}
          </Title>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={700}
        centered
      >
        {editingRecord ? (
          <div style={{ lineHeight: 2 }}>
            <p>
              <strong>Utilisateur :</strong> {editingRecord.nom}
            </p>
            <p>
              <strong>Abonnement :</strong> {editingRecord.name}
            </p>
            <p>
              <strong>Montant :</strong>{" "}
              <Text strong>${editingRecord.amount}</Text>
            </p>
            <p>
              <strong>Méthode :</strong> {editingRecord.payment_method}
            </p>
            <p>
              <strong>Transaction ID :</strong>{" "}
              <Text code>{editingRecord.transaction_id}</Text>
            </p>
            <p>
              <strong>Date paiement :</strong>{" "}
              {editingRecord.payment_date
                ? moment(editingRecord.payment_date).format("DD/MM/YYYY HH:mm")
                : "—"}
            </p>
            <p>
              <strong>Statut :</strong>{" "}
              <Tag
                color={
                  editingRecord.status === "success"
                    ? "green"
                    : editingRecord.status === "failed"
                    ? "red"
                    : "orange"
                }
              >
                {editingRecord.status.toUpperCase()}
              </Tag>
            </p>
          </div>
        ) : (
          <Text type="secondary">
            L’ajout de paiement est désactivé pour l’instant.
          </Text>
        )}
      </Modal>
    </Card>
  );
};

export default Paiement;
