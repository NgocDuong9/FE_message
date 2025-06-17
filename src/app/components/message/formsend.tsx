import { SendOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

type FieldType = {
  text?: string;
};
const FormSend = ({
  handleSendMessage,
}: {
  handleSendMessage: (text: string) => Promise<void>;
}) => {
  const [form] = useForm();
  const [text, setText] = useState<string>("");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (!values.text) return;
    handleSendMessage(values.text ?? "");
    form.resetFields();
    setText("");
  };

  const onValuesChange = (_: any, allValues: FieldType) => {
    setText(allValues.text ?? "");
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      className="flex w-full gap-2"
    >
      <Form.Item<FieldType> name="text" className="w-full outline-none">
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" disabled={!text}>
        <SendOutlined />
      </Button>
    </Form>
  );
};

export default FormSend;
