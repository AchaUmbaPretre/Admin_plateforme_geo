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
  Tooltip
} from "antd";
import { PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import DonneeForm from "../donneeForm/DonneeForm";
import { getDonnees } from "../../services/donnees.service";
import config from "../../config";
import moment from "moment";

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
    { title: "Titre", dataIndex: "titre", key: "titre", sorter: (a,b) => a.titre.localeCompare(b.titre) },
/*     { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
 */    { title: "Pays", dataIndex: "pays", key: "pays" },
    { title: "Région", dataIndex: "region", key: "region" },
    { title: "Date collecte", 
      dataIndex: "date_collecte", 
      key: "date_collecte",
      render: (date) =>
              date ? moment(date).format("DD-MM-YYYY") : "—",
            sorter: (a, b) => moment(a.date_collecte) - moment(b.date_collecte),
    },
    { 
      title: "Accès", 
      dataIndex: "acces", 
      key: "acces",
      render: acces => <Tag color={acces === "public" ? "green" : "blue"}>{acces}</Tag>
    },
    {
      title: "Fichier",
      dataIndex: "fichier_url",
      key: "fichier",
      render: url => url ? <a href={`${DOMAIN}${url}`} target="_blank" rel="noopener noreferrer">Télécharger</a> : "—"
    },
    {
      title: "Vignette",
      dataIndex: "vignette_url",
      key: "vignette",
      render: url => url ? <Image src={`${DOMAIN}${url}`} width={80} height={50} /> : "—"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="Modifier la donnée">
          <Button type="link" onClick={() => openModal(record)}>
            Modifier
          </Button>
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12 }}>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Tableau des Données</h2>
        <Space>
          <Button type="default" icon={<ReloadOutlined />} onClick={loadDonnees}>
            Rafraîchir
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Ajouter une donnée
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
          rowKey="id_donnee"
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
          sticky
        />
      )}

      {/* Modal ajout/modification */}
      <Modal
        title={editingRecord ? "Modifier une donnée" : "Ajouter une donnée"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={800}
        centered
      >
        <DonneeForm
          record={editingRecord}
          onSuccess={loadDonnees}
          setModalVisible={setModalVisible}
        />
      </Modal>
    </div>
  );
};

export default Donnees;
