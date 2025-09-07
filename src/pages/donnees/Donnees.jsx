import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Image,
  Spin,
  Button,
  Modal,
  notification,
  Space,
  Tooltip,
  Typography,
  Divider,
  Card,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import DonneeForm from "../donneeForm/DonneeForm";
import { getDonnees } from "../../services/donnees.service";
import config from "../../config";
import moment from "moment";
import "./donnees.scss";

const { Title, Text } = Typography;

const Donnees = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  /** Charger les données **/
  const loadDonnees = async () => {
    setLoading(true);
    try {
      const res = await getDonnees();
      setData(res.data);
    } catch {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les données",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonnees();
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
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
      sorter: (a, b) => a.titre.localeCompare(b.titre),
      render: (text) => <Text strong ellipsis>{text}</Text>,
    },
    {
      title: "Type",
      dataIndex: "nom_type",
      key: "nom_type",
      sorter: (a, b) => a.nom_type.localeCompare(b.nom_type),
      render: (type) => (
        <Tag color="blue" style={{ borderRadius: 8, padding: "0 8px" }}>
          {type}
        </Tag>
      ),
    },
    { title: "Pays", dataIndex: "nom_pays", key: "nom_pays" },
    { title: "Région", dataIndex: "name_fr", key: "name_fr" },
    {
      title: "Date collecte",
      dataIndex: "date_collecte",
      key: "date_collecte",
      render: (date) =>
        date ? moment(date).format("DD MMM YYYY") : <Text type="secondary">—</Text>,
      sorter: (a, b) => moment(a.date_collecte) - moment(b.date_collecte),
    },
    {
      title: "Accès",
      dataIndex: "acces",
      key: "acces",
      render: (acces) => (
        <Tag
          color={acces === "public" ? "green" : "volcano"}
          style={{ borderRadius: 8, padding: "0 10px" }}
        >
          {acces.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Fichier",
      dataIndex: "fichier_url",
      key: "fichier",
      render: (url) =>
        url ? (
          <Button
            type="link"
            icon={<FileOutlined />}
            href={`${DOMAIN}${url}`}
            target="_blank"
          >
            Télécharger
          </Button>
        ) : (
          <Text type="secondary">Aucun</Text>
        ),
    },
    {
      title: "Vignette",
      dataIndex: "vignette_url",
      key: "vignette",
      render: (url) =>
        url ? (
          <Image
            src={`${DOMAIN}${url}`}
            width={90}
            height={55}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          <Text type="secondary">Aucune</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Tooltip title="Modifier la donnée">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{
              color: "#1890ff",
              borderRadius: 8,
            }}
          >
            Modifier
          </Button>
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
            📊 Tableau des Données
          </Title>
          <Text type="secondary">
            Gérez vos données de manière efficace et élégante.
          </Text>
        </div>
        <Space>
          <Tooltip title="Rafraîchir les données">
            <Button
              shape="round"
              icon={<ReloadOutlined />}
              onClick={loadDonnees}
            >
              Rafraîchir
            </Button>
          </Tooltip>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Ajouter
          </Button>
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
          rowKey="id_donnee"
          bordered={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total: ${total} données`,
          }}
          scroll={{ x: "max-content" }}
          sticky
          size="middle"
        />
      )}

      {/* Modal ajout/modification */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={1050}
        centered
        bodyStyle={{ padding: 8, borderRadius: 12 }}
      >
        <DonneeForm
          record={editingRecord}
          onSuccess={loadDonnees}
          setModalVisible={setModalVisible}
        />
      </Modal>
    </Card>
  );
};

export default Donnees;
