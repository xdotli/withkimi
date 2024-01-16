import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import DatePicker from "@react-native-community/datetimepicker";

import {
  StyledButton,
  Container,
  HeaderText,
  SubHeaderText,
  FixedButtonContainer,
  InputContainer,
  HintText
} from "@my/ui/src/components/commonComponents";


export function EnterBirthdayScreen() {
  const [date, setDate] = useState(new Date());

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <HeaderText>Birthday</HeaderText>
        <SubHeaderText>When is your birthday?</SubHeaderText>

        <InputContainer>
          <DatePicker
            value={date}
            onChange={(e, date: Date) => {
              setDate(date);
            }}
          />
        </InputContainer>

        <HintText>
          {" "}
          You can always change this later in Profile Settings{" "}
        </HintText>

        <FixedButtonContainer>
          <StyledButton
            // {...nextLinkProps}
            cat="primary"
          >
            Next
          </StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}
