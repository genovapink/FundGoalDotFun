import type { Route } from "./+types/ca";

export async function loader({ params }: Route.LoaderArgs) {
  const addon = "rei";

  const { symbol } = params;

  return {
    symbol,
    addon,
  };
}

export default function Symbol({ loaderData }: Route.ComponentProps) {
  const { addon, symbol } = loaderData;
  return (
    <>
      <p>
        {symbol} {"//"} {addon}
      </p>
    </>
  );
}
