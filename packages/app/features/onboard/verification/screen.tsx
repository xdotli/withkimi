import React, { useRef, useState, useEffect } from "react";
import { XStack, Input, styled, Text } from "tamagui";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useLink } from "solito/link";
// import { useSignUp } from "@clerk/clerk-expo";
import { createParam } from "solito";
import { Parameters } from "../customTypes";
import { useRouter } from "solito/router";
import { formattedTime } from "../utils";

import {
  StyledButton,
  Container,
  HeaderText,
  SubHeaderText,
  FixedButtonContainer,
} from "@my/ui/src/components/commonComponents";
import colors from "../colors";
import { userRouter } from "@my/api/src/router/user";
import { verify } from "crypto";

// Number of digits in verification code
const numInputs = 6;

const { useParam } = createParam<Parameters>();

// A single block for verification code
const CodeInput = styled(Input, {
  width: 50,
  height: 51,
  marginBottom: 10,
  marginHorizontal: 5,
  fontSize: 20,
  fontWeight: "400",
  textAlign: "center",
  borderRadius: 10,
  backgroundColor: colors.yellow,
  borderColor: colors.borderYellow,
  borderWidth: 1,
});

// All 4 verfication code combined
const VerificationInputs = ({ code, setCode, onCompleted }) => {
  const inputsRef = useRef([]);

  const focusNext = (index: number, value: string) => {
    if (!value || value.length == 0) {
      return
    }

    let remainingValue;
    if (value.length > 1) {
      remainingValue = value.substring(1)
      value = value.substring(0, 1)
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (index < numInputs - 1 && value) {
      if (remainingValue) {
        focusNext(index + 1, remainingValue)
      }
      inputsRef.current[index + 1].focus();
    }
    if (newCode.every((digit) => digit !== "")) {
      onCompleted(newCode);
    }
  };

  const handleBackspace = () => {
    const newCode = [...code];
    const lastNumberIndex = newCode.findIndex((c) => c === "") - 1;
    if (lastNumberIndex === -2) {
      newCode[numInputs - 1] = ""
    }
    if (lastNumberIndex !== -1) {
      newCode[lastNumberIndex] = "";
    }
    setCode(newCode);
    handleFocus(newCode);
  };

  const handleFocus = (code) => {
    // Find the index of the first empty input
    const firstEmptyIndex = code.findIndex((c) => c === "");
    // If there's no empty input, keep the focus on the current input
    const targetIndex =
      firstEmptyIndex !== -1 ? firstEmptyIndex : numInputs - 1;
    inputsRef.current[targetIndex].focus();
  };

  return (
    <XStack justifyContent="center" marginBottom="$2">
      {code.map((digit, index) => (
        <CodeInput
          key={index}
          value={digit}
          onChangeText={(value) => focusNext(index, value)}
          onChange={(e) => {
            e.preventDefault()
          }}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Backspace") {
              e.preventDefault();
              handleBackspace();
            }
          }}
          onFocus={() => {
            handleFocus(code);
          }}
          keyboardType="numeric"
          ref={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </XStack>
  );
};


let timer: NodeJS.Timeout | undefined;
// Main component
export function VerificationCodeScreen() {
  const [code, setCode] = useState(Array(numInputs).fill(""));
  const nextLinkProps = useLink({ href: "/onboard/enter-name" });
  const [sendCodeCD, setSendCodeCD] = useState(180);
  // const { isLoaded, signUp, setActive } = useSignUp();
  const [phoneNumber] = useParam("phoneNumber");
  const { push } = useRouter();

  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (sendCodeCD > 0) {
      setSendCodeCD(sendCodeCD - 1);
    }
  }, 1000);

  useEffect(() => {
    sendVerification();
  }, []);

  const sendVerification = async () => {
    if (!isLoaded) {
      return;
    }

    // try {
    //   await signUp.create({
    //     phoneNumber: phoneNumber,
    //   });

    //   // send the verification code.
    //   await signUp.prepareVerification({ strategy: "phone_code" });
    //   setSendCodeCD(180);
    // } catch (err) {
    //   console.error(JSON.stringify(err, null, 2));
    // }
  };

  const validateCode = async (code: Array<string>) => {
    if (!isLoaded) {
      return;
    }

    // try {
    //   const completeSignUp = await signUp.attemptPhoneNumberVerification({
    //     code: code.join(""),
    //   });

    //   await setActive({ session: completeSignUp.createdSessionId });
    push("/onboard/enter-name")
    // } catch (err) {
    //   console.log("wrong code: " + code.join(""));

    //   console.error(JSON.stringify(err, null, 2));
    // }
  };
  const temphandleComplete = (code) => {
    console.log(code);

  }

  const handleSendCodePress = () => {
    sendVerification();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container>
        <HeaderText>Verification</HeaderText>
        <SubHeaderText>Please enter the verification code.</SubHeaderText>
        <VerificationInputs
          code={code}
          setCode={setCode}
          onCompleted={temphandleComplete}
        />
        <XStack>
          {sendCodeCD > 0 ? (
            <>
              <Text> {"Didn't receive any code?"} </Text>
              <Text color={colors.pink}>
                Resend in {formattedTime(sendCodeCD)}
              </Text>
            </>
          ) : (
            <Text color={colors.primary} onPress={handleSendCodePress}>
              {" "}
              Send Code{" "}
            </Text>
          )}
        </XStack>

        <FixedButtonContainer>
          <StyledButton
            // {...nextLinkProps}
            cat="primary"
            onPress={() => { validateCode(code) }}
          >
            Next
          </StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}

