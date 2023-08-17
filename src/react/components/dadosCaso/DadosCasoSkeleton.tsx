import { Skeleton } from '@mantine/core';
import React, { FC } from 'react';

const DadosCasoSkeleton: FC = () => {
  return (
    <>
      <Skeleton height={8} radius="xl" mt={6} />
      <Skeleton height={8} radius="xl" mt={6} />
      <Skeleton height={8} radius="xl" mt={6} />
      <Skeleton height={8} radius="xl" mt={6} />
      <Skeleton height={8} radius="xl" mt={6} />
    </>
  )
}

export default DadosCasoSkeleton;
