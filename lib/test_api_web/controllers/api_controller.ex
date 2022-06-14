defmodule TestApiWeb.ApiController do
  use TestApiWeb, :controller

  def any(conn, params) do
    status = params |> Map.get("status", 200) |> ensure_integer()
    body = params |> Map.get("body", %{})
    timeout = params |> Map.get("timeout", 0) |> ensure_float()

    timeout_ms = (timeout * 1000) |> trunc()

    Process.sleep(timeout_ms)

    conn
    |> put_status(status)
    |> json(body)
  end

  defp ensure_integer(string) when is_binary(string) do
    {integer, _} = string |> Integer.parse()

    integer
  end

  defp ensure_integer(number) when is_number(number) do
    number |> trunc()
  end

  defp ensure_float(string) when is_binary(string) do
    {float, _} = string |> Float.parse()

    float
  end

  defp ensure_float(number) when is_number(number) do
    number
  end
end
