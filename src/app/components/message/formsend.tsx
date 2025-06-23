import { SendOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

type FieldType = {
  text?: string;
};
const FormSend = ({
  handleSendMessage,
}: {
  handleSendMessage: (text: string) => Promise<void>;
}) => {
  const [form] = useForm();
  const [text, setText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setText(prevText => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = () => {
    handleSendMessage(text ?? '');
    form.resetFields();
    setText('');
  };

  const onValuesChange = (_: any, allValues: FieldType) => {
    setText(allValues.text ?? '');
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      className="flex w-full gap-2"
    >
      {showEmojiPicker && (
        <div className="absolute z-10 bottom-16 right-0">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <Form.Item<FieldType> name="text" className="w-full outline-none">
        <div className="flex items-center">
          <Input value={text} onChange={e => setText(e.target.value)} />
          <Button type="default" onClick={() => setShowEmojiPicker(prev => !prev)} className="ml-2">
            😊
          </Button>
        </div>
      </Form.Item>

      <Button type="primary" htmlType="submit" disabled={!text}>
        <SendOutlined />
      </Button>
    </Form>
  );
};

export default FormSend;
