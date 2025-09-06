import { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Radio,
  Upload,
  notification,
  InputNumber,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { postDonnees } from "../../services/donnees.service";
import { getPays, getProvince, getType } from "../../services/type.service";

const { TextArea } = Input;

const DonneeForm = ({ record, onSuccess, setModalVisible }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(record?.fichier_url || null);
  const [thumbPreview, setThumbPreview] = useState(record?.vignette_url || null);
  const [types, setTypes] = useState([]);
  const [pays, setPays] = useState([]);
  const [province, setProvince] = useState([])


  // Charger les types au montage
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const [typeData, paysData, provinceData] = await Promise.all([
          getType(),
          getPays(),
          getProvince()
        ]) 
        setTypes(typeData.data || []);
        setPays(paysData.data);
        setProvince(provinceData.data);

      } catch (err) {
        console.error("Erreur chargement types:", err);
      }
    };
    fetchTypes();
  }, []);

  // Pré-remplir si on édite
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        date_collecte: record.date_collecte ? moment(record.date_collecte) : null,
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleBeforeUpload = (file, type) => {
    type === "file" ? setFilePreview(file) : setThumbPreview(file);
    return false;
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (key === "date_collecte" && val) {
          formData.append(key, val.format("YYYY-MM-DD"));
        } else {
          formData.append(key, val || "");
        }
      });

      if (filePreview instanceof File) formData.append("fichier", filePreview);
      if (thumbPreview instanceof File) formData.append("vignette", thumbPreview);

      await postDonnees(formData);

      notification.success({ message: "Succès", description: "Donnée ajoutée" });
      setModalVisible(false);
      onSuccess(); // recharge la table
    } catch (err) {
      console.error(err);
      notification.error({ message: "Erreur", description: "Impossible de sauvegarder la donnée" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Type de donnée"
            name="id_type"
            rules={[{ required: true, message: "Le type est obligatoire" }]}
          >
            <Select
              showSearch
              options={types.map((item) => ({
                value: item.id_type,
                label: item.nom_type,
              }))}
              placeholder="Sélectionnez un type..."
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Titre"
            name="titre"
            rules={[{ required: true, message: "Le titre est obligatoire" }]}
          >
            <Input placeholder="Titre de la donnée" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Pays" name="pays">
            <Select
              showSearch
              options={pays.map((item) => ({
                value: item.id_pays,
                label: item.nom_pays,
              }))}
              placeholder="Sélectionnez un type..."
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Région" name="region">
            <Select
              showSearch
              options={province.map((item) => ({
                value: item.id,
                label: item.name_fr,
              }))}
              placeholder="Sélectionnez une province..."
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Latitude"
            name="latitude"
            rules={[
              { type: "number", min: -90, max: 90, message: "Latitude invalide" },
            ]}
          >
            <InputNumber
              placeholder="Ex: 4.345678"
              step={0.000001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Longitude"
            name="longitude"
            rules={[
              { type: "number", min: -180, max: 180, message: "Longitude invalide" },
            ]}
          >
            <InputNumber
              placeholder="Ex: 15.345678"
              step={0.000001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Description" name="description">
        <TextArea rows={4} placeholder="Description détaillée..." />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Date collecte" name="date_collecte">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Accès" name="acces" initialValue="abonne">
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="abonne">Abonné</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Fichier">
            <Upload
              beforeUpload={(file) => handleBeforeUpload(file, "file")}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Téléverser le fichier</Button>
            </Upload>
            {filePreview && (
              <div style={{ marginTop: 8 }}>
                {filePreview.name || filePreview}
              </div>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Vignette">
            <Upload
              beforeUpload={(file) => handleBeforeUpload(file, "thumb")}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Téléverser la vignette</Button>
            </Upload>
            {thumbPreview && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(thumbPreview)}
                  alt="Vignette"
                  width={100}
                />
              </div>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Meta (JSON)"
        name="meta"
        rules={[
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              try {
                JSON.parse(value);
                return Promise.resolve();
              } catch {
                return Promise.reject(new Error("JSON invalide"));
              }
            },
          },
        ]}
      >
        <TextArea rows={3} placeholder='{"key":"value"}' />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {record ? "Mettre à jour" : "Ajouter"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DonneeForm;
