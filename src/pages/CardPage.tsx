import { useParams } from "react-router-dom";

function CardPage() {
  const { id } = useParams();
  return <div>{id}</div>;
}

export default CardPage;
