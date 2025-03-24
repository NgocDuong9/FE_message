import { useAuth } from "@/context/authContext";
import SelectFriend from "./SelectFriend";
import { Conversation } from "@/type/conversation";

const LeftMessage = ({
  conversation,
  setConversationSelect,
}: {
  conversation: Conversation[];
  setConversationSelect: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
}) => {
  const { user } = useAuth();

  return (
    <div>
      <div className="border-b px-3 pb-2 w-full">
        <input
          type="text"
          className="w-full outline-none"
          placeholder="Search name"
        />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        {conversation?.map((item, idx) => {
          const dataMember = item.members.find(
            (item) => item._id !== user?._id
          );

          return (
            <div key={idx} onClick={() => setConversationSelect(item)}>
              <SelectFriend
                key={idx}
                name={dataMember?.username ?? ""}
                // image={dataMember?.profilePicture ?? ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftMessage;
