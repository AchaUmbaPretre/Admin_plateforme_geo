import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Spin,
  Modal,
  notification,
  Tooltip,
  Space,
  Typography,
  Card,
  Divider,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getUsers } from "../../services/user.service";

const { Title, Text } = Typography;

const Utilisateur = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  /** Charger les utilisateurs **/
  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setData(res.data);
    } catch {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de charger la liste des utilisateurs.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  /** Ouvrir le modal **/
  const openModal = (record = null) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  /** Colonnes du tableau **/
  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: "#fa8c16" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: "#52c41a" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={role === "admin" ? "#ff4d4f" : "#2f54eb"}
          icon={<CrownOutlined />}
          style={{ borderRadius: 8, padding: "0 10px" }}
        >
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Abonné", value: "abonne" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Expiration",
      dataIndex: "abonnement_expires_le",
      key: "abonnement_expires_le",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY") : "—",
    },
    {
      title: "Créé le",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.created_at) - moment(b.created_at),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Voir / Modifier">
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
            👥 Gestion des Utilisateurs
          </Title>
          <Text type="secondary">
            Liste complète des utilisateurs avec rôles et abonnements.
          </Text>
        </div>
        <Space>
          <Tooltip title="Rafraîchir">
            <Button
              type="default"
              shape="round"
              icon={<ReloadOutlined />}
              onClick={fetchUtilisateurs}
            >
              Rafraîchir
            </Button>
          </Tooltip>
          <Tooltip title="Ajouter un utilisateur">
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              Nouvel utilisateur
            </Button>
          </Tooltip>
        </Space>
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
          rowKey="id_utilisateur"
          bordered={false}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total: ${total} utilisateurs`,
          }}
          scroll={{ x: "max-content" }}
          sticky
          size="middle"
        />
      )}

      {/* MODAL */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingRecord ? "Détails de l’utilisateur" : "Nouvel utilisateur"}
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
            <p><strong>Nom :</strong> {editingRecord.nom}</p>
            <p><strong>Email :</strong> {editingRecord.email}</p>
            <p><strong>Téléphone :</strong> {editingRecord.phone}</p>
            <p><strong>Rôle :</strong> {editingRecord.role.toUpperCase()}</p>
            <p>
              <strong>Expiration :</strong>{" "}
              {editingRecord.abonnement_expires_le
                ? moment(editingRecord.abonnement_expires_le).format("DD/MM/YYYY")
                : "—"}
            </p>
            <p>
              <strong>Créé le :</strong>{" "}
              {moment(editingRecord.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        ) : (
          <Text type="secondary">
            Le formulaire d’ajout d’utilisateur est désactivé pour l’instant.
          </Text>
        )}
      </Modal>
    </Card>
  );
};

export default Utilisateur;
