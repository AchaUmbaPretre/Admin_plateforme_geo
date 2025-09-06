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

const Utilisateur = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"} icon={<CrownOutlined />}>
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
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "—"),
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
      render: (_, record) => (
        <Tooltip title="Voir / Modifier l’utilisateur">
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
        <h2 style={{ margin: 0 }}>Gestion des Utilisateurs</h2>
        <Space>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={fetchUtilisateurs}
          >
            Rafraîchir
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Nouvel utilisateur
          </Button>
        </Space>
      </Space>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_utilisateur"
          bordered
          pagination={{ pageSize: 8, showSizeChanger: true }}
          scroll={{ x: true }}
          sticky
        />
      )}

      {/* MODAL */}
      <Modal
        title={editingRecord ? "Détails de l’utilisateur" : "Nouvel utilisateur"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        confirmLoading={modalLoading}
        destroyOnClose
      >
        {editingRecord ? (
          <div style={{ lineHeight: 2 }}>
            <p><strong>Nom :</strong> {editingRecord.nom}</p>
            <p><strong>Email :</strong> {editingRecord.email}</p>
            <p><strong>Téléphone :</strong> {editingRecord.phone}</p>
            <p><strong>Rôle :</strong> {editingRecord.role}</p>
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
          <p>Formulaire d’ajout d’utilisateur désactivé pour l’instant.</p>
        )}
      </Modal>
    </div>
  );
};

export default Utilisateur;
