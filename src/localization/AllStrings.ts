import { Strings } from '@twilio/flex-ui';

export interface AllStrings<T = string> extends Strings<T> {
  WrapUpLabel: T;
  WrapUpReason: T;
  PreferredChannel: T;
  WrapUpDisposition: T;
  WrapUpFraud: T;
  WrapUpNewCustomer: T;
  WrapUpSelectOutcomeNotification: T;
}
