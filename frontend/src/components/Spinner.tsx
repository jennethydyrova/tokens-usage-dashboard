import { Spin } from "antd";

export const Spinner = () => {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;

  return (
    <>
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </>
  );
};
