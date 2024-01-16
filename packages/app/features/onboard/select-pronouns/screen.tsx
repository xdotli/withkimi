import React, { useMemo, useState } from "react";
import { Sheet, Adapt, YStack, Select, styled } from "tamagui";
import { Check, ChevronDown } from "@tamagui/lucide-icons";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useLink } from "solito/link";

import colors from "../colors";
import {
  StyledButton,
  Container,
  HeaderText,
  SubHeaderText,
  FixedButtonContainer,
  InputContainer,
} from "@my/ui/src/components/commonComponents";

const pronouns = ["He / him", "She / her", "They / them", "Other"];

const PronounsSelect = styled(Select, {
  flex: 1,
});

export function SelectPronounsScreen() {
  const [val, setVal] = useState("");
  const nextLinkProps = useLink({ href: "/onboard/enter-birthday" });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <HeaderText>Pronouns</HeaderText>
        <SubHeaderText>What{"'"}s your Pronouns</SubHeaderText>

        <InputContainer>
          {/* <PronounsSelect value={val} onValueChange={setVal}>
            <Select.Trigger
              iconAfter={ChevronDown}
              backgroundColor="$colorTransparent"
            >
              <Select.Value placeholder="Select Pronouns" color={colors.gray} />
            </Select.Trigger>
            <Adapt when="sm" platform="touch">
              <Sheet
                dismissOnSnapToBottom
                animationConfig={{
                  type: "spring",
                  damping: 20,
                  mass: 1.2,
                  stiffness: 250,
                }}
              >
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>
            <Select.Content>
              <Select.ScrollUpButton />
              <Select.Viewport>
                <Select.Group>
                  <Select.Item index={1} key={1} value="he/him">
                    <Select.ItemText>haha</Select.ItemText>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </PronounsSelect> */}
        </InputContainer>

        <FixedButtonContainer>
          <StyledButton {...nextLinkProps} cat="primary">Next</StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}
