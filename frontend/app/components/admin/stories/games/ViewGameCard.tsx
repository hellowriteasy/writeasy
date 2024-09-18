import Link from "next/link";

interface CardProps {
  title: string;
  id: string;
}

const Card: React.FC<CardProps> = ({ title, id }) => {
  return (
    <Link href={`/admin/stories/games/${id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold font-unkempt">{title}</div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
