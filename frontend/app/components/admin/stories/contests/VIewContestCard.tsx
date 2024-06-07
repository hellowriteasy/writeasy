import Link from "next/link"; 
interface CardProps {
  title: string;
  deadline: Date | string;
  id: string;
  theme: string;
}

const Card: React.FC<CardProps> = ({ title, deadline, id }) => {
  let formattedDeadline = '';

  if (typeof deadline === 'string') {
    // If deadline is a string, try to parse it as a Date object
    const parsedDeadline = new Date(deadline);
    if (!isNaN(parsedDeadline.getTime())) {
      formattedDeadline = parsedDeadline.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      // Handle invalid date string
      console.error('Invalid deadline:', deadline);
      formattedDeadline = 'Invalid deadline';
    }
  } else if (deadline instanceof Date) {
    // If deadline is already a Date object, format it directly
    formattedDeadline = deadline.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else {
    // Handle unsupported deadline type
    console.error('Unsupported deadline type:', deadline);
    formattedDeadline = 'Unsupported deadline';
  }

  return (
    <Link href={`/admin/stories/contests/${id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">{title}</div>
        </div>
        <div className="text-gray-600">Deadline: {formattedDeadline}</div>
      </div>
    </Link>
  );
};

export default Card;
