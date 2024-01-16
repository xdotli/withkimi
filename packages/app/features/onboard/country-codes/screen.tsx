import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, styled, Text } from "tamagui";
import { } from "solito";
import { useRouter } from "solito/router";

import colors from "../colors";

import {
  HeaderText,
  ContainerCenter,
  HintText,
  InputContainer,
} from "@my/ui/src/components/commonComponents";

import countryCodes from "app/assets/CountryCodes.json";
import { Parameters } from "../customTypes";
import { generateParamURL } from "../utils";

// container of subsections of country codes
const SubContainer = styled(YStack, {
  width: "100%",
  paddingHorizontal: 30,
  justifyContent: "flex-start",
});

const SubTitle = styled(HintText, {
  marginBottom: 15,
  marginLeft: 5,
});

// contains a line of country/countyCode
const LineContainer = styled(XStack, {
  width: "100%",
  paddingHorizontal: 20,
  paddingVertical: 15,
  justifyContent: "space-between",
});

export function CountryCodesScreen() {
  const { push, replace, back, parseNextPath } = useRouter();
  // const [phoneCode, SetPhoneCode] = useParam("phoneCode");

  return (
    <ScrollView style={{ flex: 1 }}>
      <ContainerCenter>
        <HeaderText>Choose Country and Region</HeaderText>
        <SubContainer>
          <SubTitle>Based on your location</SubTitle>
          <InputContainer>
            <LineContainer>
              <Text> United States</Text>
              <Text> +1 </Text>
            </LineContainer>
          </InputContainer>
        </SubContainer>
        <SubContainer>
          <SubTitle>Alphabetical</SubTitle>
          {countryCodes.map((item) => {
            return (
              <LineContainer
                key={item.name}
                style={{
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,
                  borderBottomStyle: "dashed",
                }}
                onPress={() => {
                  push(
                    generateParamURL<Parameters>("/onboard/phone-input", {
                      phoneCode: item.dial_code,
                    })
                  );
                }}
              >
                <Text> {item.name} </Text>
                <Text> {item.dial_code} </Text>
              </LineContainer>
            );
          })}
        </SubContainer>
      </ContainerCenter>
    </ScrollView>
  );
}
