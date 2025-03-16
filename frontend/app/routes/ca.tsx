import { DynamicHeader } from "@fund/dynamic-header";
import type { Route } from "./+types/ca";

export async function loader({ params }: Route.LoaderArgs) {
  const addon = "rei";

  const { ca } = params;

  return {
    ca,
    addon,
  };
}

export default function Symbol({ loaderData }: Route.ComponentProps) {
  const { addon, ca } = loaderData;
  return (
    <>
      <DynamicHeader title="Details" />
      <div className="container mt-8">
        <p>
          {ca} {"//"} {addon}
        </p>
      </div>
    </>
  );
}
