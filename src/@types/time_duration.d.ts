type Unit = 'w' | 'd' | 'h' | 'min';

type UnitAnyCase = Unit | Uppercase<Unit>;

type TimeDuration = `${number}${UnitAnyCase}`;
