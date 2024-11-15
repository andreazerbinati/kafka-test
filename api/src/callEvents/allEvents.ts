// allEvents.ts
import {
  CallTransferByNameEvent,
  PhoneticSearchResultEvent,
  PhoneticSearchResultKoEvent,
  IntentRecognizedFaqEvent,
  FaqAnswerOkEvent,
  FaqAnswerKoEvent,
  InputNotRecognizedEvent,
  FallbackHangupEvent,
  FallbackReturnToMainMenuEvent,
  ReturnedToMainMenuEvent,
  FallbackTransferEvent,
  TransferEvent,
  CallTransferredEvent,
  FallbackAskToLeaveAMsgEvent,
  MsgLeftEvent,
} from "./events";

export type AllCallEvents =
  | CallTransferByNameEvent
  | PhoneticSearchResultEvent
  | PhoneticSearchResultKoEvent
  | IntentRecognizedFaqEvent
  | FaqAnswerOkEvent
  | FaqAnswerKoEvent
  | InputNotRecognizedEvent
  | FallbackHangupEvent
  | FallbackReturnToMainMenuEvent
  | ReturnedToMainMenuEvent
  | FallbackTransferEvent
  | TransferEvent
  | CallTransferredEvent
  | FallbackAskToLeaveAMsgEvent
  | MsgLeftEvent;
