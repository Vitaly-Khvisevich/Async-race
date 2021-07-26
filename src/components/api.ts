const baseURL = 'http://localhost:3000';

const garage = `${baseURL}/garage`;
const engine = `${baseURL}/engine`;
const winners = `${baseURL}/winners`;

export const getCars = async (
  page: number,
  limit = 7
): Promise<{ items: { name: string; color: string; id: number }[]; count: string | null }> => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await response.json(),
    count: response.headers.get('X-Total-Count'),
  };
};

export const getCar = async (id: number): Promise<{ name: string; color: string; id: number }> =>
  (await fetch(`${garage}/${id}`)).json();

export const createCar = async (body: { name: string; color: string }): Promise<void> =>
  (
    await fetch(garage, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const deleteCar = async (id: number): Promise<void> =>
  (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();

export const updateCar = async (id: number, body: { name: string; color: string }): Promise<void> =>
  (
    await fetch(`${garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const startEngine = async (id: number): Promise<{ distance: number; velocity: number }> =>
  (await fetch(`${engine}?id=${id}&status=started`)).json();
export const stopEngine = async (id: number): Promise<void> =>
  (await fetch(`${engine}?id=${id}&status=stopped`)).json();

export const drive = async (id: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${engine}?id=${id}&status=drive`).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export const getWinners = async ({
  page,
  limit = 10,
  sort,
  order,
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
}): Promise<{
  items: { id: number; wins: number; time: number; car: { name: string; color: string; id: number } }[];
  count: string | null;
}> => {
  const response = await fetch(`${winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
  const item = await response.json();

  return {
    items: await Promise.all(
      item.map(async (winner: { [x: string]: number }) => ({ ...winner, car: await getCar(winner.id) }))
    ),
    count: response.headers.get('X-Total-Count'),
  };
};

export const getWinner = async (id: number): Promise<{ id: number; wins: number; time: number }> =>
  (await fetch(`${winners}/${id}`)).json();
export const getWinnerStatus = async (id: number): Promise<number> => (await fetch(`${winners}/${id}`)).status;
export const deleteWinner = async (id: number): Promise<void> =>
  (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();

export const createWinner = async (body: { id: number; wins: number; time: number }): Promise<void> =>
  (
    await fetch(winners, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export const updateWinner = async (id: number, body: { wins: number; time: number }): Promise<void> =>
  (
    await fetch(`${winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
