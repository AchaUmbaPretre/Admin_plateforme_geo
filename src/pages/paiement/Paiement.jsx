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
} from "antd";
import { EditOutlined, ReloadOutlined, DollarOutlined } from "@ant-design/icons";
import moment from "moment";
import { getPayment } from "../../services/payment.service";

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

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => index + 1
    },
    {
      title: "Utilisateur",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Abonnement",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Montant",
      dataIndex: "amount",
      key: "amount",
      render: (val) => (
        <Space>
          <DollarOutlined />
          ${val}
        </Space>
      ),
    },
    {
      title: "Méthode",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
    },
    {
      title: "Date paiement",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date) =>
        date ? moment(date).format("DD-MM-YYYY HH:mm") : "—",
      sorter: (a, b) => moment(a.payment_date) - moment(b.payment_date),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "success" ? "green" : status === "failed" ? "red" : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
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
      render: (_, record) => (
        <Tooltip title="Voir / Modifier le paiement">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12 }}>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Tableau des Paiements</h2>
        <Button type="default" icon={<ReloadOutlined />} onClick={fetchPaiements}>
          Rafraîchir
        </Button>
      </Space>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_payments"
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
          sticky
          size="small"
        />
      )}

      {/* Modal détails paiement */}
      <Modal
        title={editingRecord ? "Détails du paiement" : "Ajouter un paiement"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={700}
      >
        {editingRecord ? (
          <div style={{ lineHeight: 2 }}>
            <p><strong>Utilisateur :</strong> {editingRecord.id_utilisateur}</p>
            <p><strong>Abonnement :</strong> {editingRecord.subscription_id}</p>
            <p><strong>Montant :</strong> ${editingRecord.amount}</p>
            <p><strong>Méthode :</strong> {editingRecord.payment_method}</p>
            <p><strong>Transaction ID :</strong> {editingRecord.transaction_id}</p>
            <p>
              <strong>Date paiement :</strong>{" "}
              {editingRecord.payment_date
                ? moment(editingRecord.payment_date).format("DD/MM/YYYY HH:mm")
                : "—"}
            </p>
            <p><strong>Statut :</strong> {editingRecord.status}</p>
          </div>
        ) : (
          <p>Ajout de paiement désactivé pour l’instant.</p>
        )}
      </Modal>
    </div>
  );
};

export default Paiement;
