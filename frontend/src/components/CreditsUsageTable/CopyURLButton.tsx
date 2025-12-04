import { Button } from "antd";

export const CopyURLButton = () => {
  const handleButtonClick = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Button color="purple" variant="filled" onClick={handleButtonClick}>
      Copy table URL
    </Button>
  );
};
