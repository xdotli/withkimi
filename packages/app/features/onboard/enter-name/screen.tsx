import React from "react";
import { Text, styled } from "tamagui";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useLink } from "solito/link";

import {
  StyledButton,
  Container,
  HeaderText,
  SubHeaderText,
  FixedButtonContainer,
  InputContainer,
  CustomInput,
  HintText,
} from "@my/ui/src/components/commonComponents";

export function EnterNameScreen() {
  const nextLinkProps = useLink({ href: "/onboard/select-pronouns" });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <HeaderText>Name</HeaderText>
        <SubHeaderText>What do you want to be called by?</SubHeaderText>

        <InputContainer>
          <CustomInput placeholder="Enter your name" />
        </InputContainer>

        <HintText>
          {" "}
          You can always change this later in Profile Settings{" "}
        </HintText>

        <FixedButtonContainer>
          <StyledButton {...nextLinkProps} cat="primary">
            Next
          </StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}
