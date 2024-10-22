import Link from "next/link";
import moment from "moment";
interface CardProps {
  title: string;
  deadline: Date | string;
  id: string;
  theme: string;
}

const Card: React.FC<CardProps> = ({ title, deadline, id }) => {
  return (
    <Link href={`/admin/stories/contests/${id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
        </div>
        <div className="text-gray-600">
          Deadline: {moment(deadline).format("lll")}
        </div>
      </div>
    </Link>
  );
};

export default Card;
