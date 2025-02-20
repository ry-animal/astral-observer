import { ReactNode } from 'react';
import { Box, Stack, Text, useColorModeValue } from '@interchain-ui/react';
import { Astronaut } from './astronaut';

export type UserProps = {
  name: string;
  icon?: ReactNode;
};

export function User({ name, icon = <Astronaut /> }: UserProps) {
  return (
    <Stack direction="vertical">
      <Box width="$19" height="$19" mx="auto" borderRadius="$full" className="mt-4">
        {icon}
      </Box>
      <Box textAlign="center" py="$4" mb="$6">
        <Text color={useColorModeValue('$gray700', '$white')} fontSize="$xl" fontWeight="$medium">
          <span className="font-apex">{name}</span>
        </Text>
      </Box>
    </Stack>
  );
}
