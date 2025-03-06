import { useState } from "react";

interface Props {
  userId: string;
}

const Button = ({ userId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      await fetch("/api/shopper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAction} disabled={loading}>
      {loading ? "Loading..." : "Assign"}
    </button>
  );
};

export default Button;
