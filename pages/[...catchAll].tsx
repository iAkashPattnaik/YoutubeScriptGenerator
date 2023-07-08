import { ErrorComponent } from "@refinedev/mui";
import { GetServerSideProps } from "next";

export default function CatchAll() {
  return <ErrorComponent />;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  return {
    props: {},
  };
};
