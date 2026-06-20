// THIS IS A NOVA SECTOR UI FILE

import {
  AnimatedNumber,
  Button,
  LabeledList,
  NoticeBox,
  Section,
  Stack,
} from 'tgui-core/components';
import { formatMoney } from 'tgui-core/format';
import type { BooleanLike } from 'tgui-core/react';

import { useBackend } from '../backend';
import { Window } from '../layouts';

type DepartmentAccount = {
  id: string;
  name: string;
  balance: number;
  color: string;
  selected: BooleanLike;
};

type Data = {
  current_balance: number;
  departments: DepartmentAccount[];
  selected_department: string;
  siphoning: BooleanLike;
  station_name: string;
  total_balance: number;
};

export const BankMachineNova = () => {
  const { act, data } = useBackend<Data>();
  const {
    current_balance,
    departments = [],
    selected_department = 'No Budget',
    siphoning,
    station_name,
    total_balance = 0,
  } = data;

  return (
    <Window width={540} height={340}>
      <Window.Content>
        <NoticeBox danger>Authorized personnel only</NoticeBox>
        <Section title={`${station_name} Vault`}>
          <LabeledList>
            <LabeledList.Item label="Selected Budget">
              {selected_department}
            </LabeledList.Item>
            <LabeledList.Item
              label="Current Balance"
              buttons={
                <Button
                  icon={siphoning ? 'times' : 'sync'}
                  content={siphoning ? 'Stop Siphoning' : 'Siphon Credits'}
                  selected={siphoning}
                  onClick={() => act(siphoning ? 'halt' : 'siphon')}
                />
              }
            >
              <AnimatedNumber
                value={current_balance}
                format={(value) => formatMoney(value)}
              />
              {' cr'}
            </LabeledList.Item>
            <LabeledList.Item label="Total Budget Balance">
              <AnimatedNumber
                value={total_balance}
                format={(value) => formatMoney(value)}
              />
              {' cr'}
            </LabeledList.Item>
          </LabeledList>
        </Section>
        <Section title="Department Accounts">
          <Stack wrap g={0.5}>
            {departments.map((department) => (
              <Stack.Item key={department.id} basis="49%" grow>
                <Button
                  fluid
                  icon={department.selected ? 'circle-check' : 'building'}
                  color={department.color}
                  selected={department.selected}
                  disabled={siphoning}
                  onClick={() =>
                    act('select_department', { department: department.id })
                  }
                >
                  {department.name}: {formatMoney(department.balance)} cr
                </Button>
              </Stack.Item>
            ))}
          </Stack>
        </Section>
      </Window.Content>
    </Window>
  );
};
