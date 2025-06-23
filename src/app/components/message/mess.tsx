import { useAuth } from '@/context/authContext';
import { Message } from '@/type/conversation';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const LisIcon = ['😄', '😰', '❤️', '🙂', '😂', '😭'];

const Mess = ({
  text,
  time,
  // img,
  own = false,
  hiddenAvatar,
  replyTo,
  handleSelect,
  showEmojiPicker,
  setShowEmojiPicker,
  isShowEmojiPicker,
  message,
  handleUpdateMessage,
}: {
  message?: Message;
  text: string;
  time: string;
  img?: string;
  own?: boolean;
  hiddenAvatar: boolean;
  replyTo: string | null;
  handleSelect: (type: 'reply' | 'edit' | 'delete' | 'select' | 'none' | undefined) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  isShowEmojiPicker: boolean;
  handleUpdateMessage: (
    messageId: string,
    emoji: {
      emoji: string;
      senderId?: string;
    },
    type: string
  ) => Promise<void>;
}) => {
  const createdAt = dayjs(time).format('HH:mm');

  const { user } = useAuth();

  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <div
      className={twMerge(
        'flex gap-2 flex-col w-ful p-2 rounded-lg relative',
        own && 'items-end',
        hiddenAvatar && ' pl-12'
      )}
    >
      <div className="flex gap-1 items-end">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          className={twMerge((own || hiddenAvatar) && 'hidden', 'size-9')}
        />

        <div className="relative group">
          {replyTo && (
            <p
              className={twMerge(
                'text-xs text-black text-center h-fit p-2  bg-[#c3c2c2a4] -mb-1.5 rounded-tl-xl',
                own ? 'rounded-tl-lg' : 'rounded-tr-lg'
              )}
            >
              {replyTo}
            </p>
          )}
          <div
            className={twMerge(
              'text-sm text-white text-center h-fit p-2 transition-transform transform hover:scale-105 relative',
              own ? 'bg-[#ed5858] rounded-l-lg' : 'bg-[#1877f2] rounded-r-lg'
            )}
          >
            {text}
            {showEmojiPicker && isShowEmojiPicker && (
              <div
                className={twMerge(
                  'absolute z-10 -bottom-5  bg-[#8a8a8aea] px-2 rounded-lg',
                  own ? 'right-0' : 'left-0'
                )}
              >
                <div className="flex gap-2">
                  {LisIcon.map((emoji, index) => (
                    <span
                      key={index}
                      className="cursor-pointer text-2xl hover:scale-125 transition-transform"
                      onClick={() => {
                        handleUpdateMessage(
                          message?._id ?? '',
                          {
                            emoji,
                            senderId: user?._id,
                          },
                          'emoji'
                        );
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {message?.emoji && (
              <div
                className={twMerge(
                  'absolute px-1 -bottom-3 bg-[#e4ddddf9] rounded-full flex',
                  own ? 'hidden' : '-right-2'
                )}
              >
                {message?.emoji?.map(emoji => (
                  <p key={emoji.senderId}>{emoji?.emoji}</p>
                ))}
              </div>
            )}
          </div>
          <div
            className={twMerge(
              'absolute hidden  gap-2 top-1/2 -translate-y-1/2 px-2',
              own ? '-translate-x-full -left-0 flex-row-reverse' : 'translate-x-full -right-0',
              showEmojiPicker && isShowEmojiPicker ? '' : 'group-hover:flex'
            )}
          >
            <p
              className="bg-slate-100 rounded-md flex items-center justify-center"
              onClick={() => handleSelect('reply')}
            >
              <i className="ri-reply-line"></i>
            </p>
            <p
              className="bg-slate-100 rounded-md flex items-center justify-center"
              onClick={() => {
                handleSelect('edit');
                setShowEmojiPicker(true);
              }}
            >
              <i className="ri-emoji-sticker-line"></i>{' '}
            </p>
            <p
              className="bg-slate-100 rounded-md flex items-center justify-center"
              onClick={() => {
                // handleSelect('edit');
                // setShowEmojiPicker(true);
                setShowMore(true);
              }}
            >
              <i className="ri-more-2-line"></i>
            </p>
          </div>
        </div>
        {message?.emoji && (
          <p
            className={twMerge(
              'absolute px-1 -bottom-2 bg-[#e4ddddf9] rounded-full ',
              own ? 'right-0' : 'hidden'
            )}
          >
            {message?.emoji?.map(emoji => emoji.emoji).join(' ')}
          </p>
        )}
      </div>

      <p className={twMerge('text-xs opacity-45 hidden')}>{createdAt}</p>
    </div>
  );
};

export default Mess;
