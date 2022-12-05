import useSWR from 'swr';
import { Product } from '@prisma/client';
import Item from '@components/item';

interface ProductListProps {
  kind: 'Fav' | 'Sale' | 'Purchase';
}

interface IProductWithCount extends Product {
  _count: {
    records: number;
  };
}

interface IRecord {
  id: number;
  product: IProductWithCount;
}

interface IRecordsResponse {
  ok: boolean;
  records: IRecord[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<IRecordsResponse>(
    `/api/users/me/records?kind=${kind}`
  );

  return data ? (
    <>
      {data?.records.map(record => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.records}
        />
      ))}
    </>
  ) : null;
}
