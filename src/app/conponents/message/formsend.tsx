import { SendOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

type FieldType = {
  text?: string;
};
const FormSend = ({
  handleSendMessage,
}: {
  handleSendMessage: (text: string) => Promise<void>;
}) => {
  const [form] = useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (!values.text) return;
    handleSendMessage(values.text ?? "");
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      className="flex w-full gap-2"
    >
      <Form.Item<FieldType> name="text" className="w-full">
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        <SendOutlined />
      </Button>
    </Form>
  );
};

export default FormSend;
