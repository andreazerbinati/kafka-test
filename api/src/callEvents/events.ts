import { EventCommonProperties } from "./eventCommonProperties";
import { CallEventType } from "./callEventTypes";

interface BaseEvent extends EventCommonProperties {
  callEvent: CallEventType;
}

export interface CallTransferByNameEvent extends BaseEvent {
  callEvent: "intentRecognizedCallTransferByName";
  additionalInfo: {
    transcription: string;
    labelToSearch: string;
  };
}

export interface PhoneticSearchResultEvent extends BaseEvent {
  callEvent: "phoneticSearchResult";
  additionalInfo: {
    resultList: Array<{
      firstName: string;
      lastName: string;
      phoneNumber: string;
    }>;
  };
}

export interface PhoneticSearchResultKoEvent extends BaseEvent {
  callEvent: "phoneticSearchResultKo";
}

export interface IntentRecognizedFaqEvent extends BaseEvent {
  callEvent: "intentRecognizedFaq";
  additionalInfo: {
    transcription: string;
    question: string;
  };
}

export interface FaqAnswerOkEvent extends BaseEvent {
  callEvent: "faqAnswerOk";
  additionalInfo: {
    answer: string;
    kbName: string;
    kbSource: string;
  };
}

export interface FaqAnswerKoEvent extends BaseEvent {
  callEvent: "faqAnswerKo";
  additionalInfo: {
    kbName: string;
  };
}

export interface InputNotRecognizedEvent extends BaseEvent {
  callEvent: "inputNotRecognized";
  additionalInfo: {
    transcription: string;
  };
}

export interface FallbackHangupEvent extends BaseEvent {
  callEvent: "fallbackHangup";
}

export interface FallbackReturnToMainMenuEvent extends BaseEvent {
  callEvent: "fallbackReturnToMainMenu";
}

export interface ReturnedToMainMenuEvent extends BaseEvent {
  callEvent: "returnedToMainMenu";
}

export interface FallbackTransferEvent extends BaseEvent {
  callEvent: "fallbackTransfer";
}

export interface TransferEvent extends BaseEvent {
  callEvent: "transfer";
  additionalInfo: {
    destination: string;
  };
}

export interface CallTransferredEvent extends BaseEvent {
  callEvent: "callTransferred";
  additionalInfo: {
    destination: string;
  };
}

export interface FallbackAskToLeaveAMsgEvent extends BaseEvent {
  callEvent: "fallbackAskToLeaveAMsg";
}

export interface MsgLeftEvent extends BaseEvent {
  callEvent: "msgLeft";
  additionalInfo: {
    originalTranscription: string;
    formattedTranscription: string;
    contact: {
      firstName: string;
      lastName: string;
      number: string;
    };
    destination: string;
  };
}
