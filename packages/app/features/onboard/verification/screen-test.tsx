import React, { useRef, useState, useEffect } from "react";
import { XStack, Input, styled, Text } from "tamagui";
import { KeyboardAvoidingView, Platform } from "react-native";
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
// import { verify } from "crypto";

// Number of digits in verification code
const numInputs = 6;

const { useParam } = createParam<Parameters>();

// A single block for verification code
const CodeBlock = styled(XStack, {
  width: 50,
  height: 51,
  marginBottom: 10,
  marginHorizontal: 5,
  borderRadius: 10,
  backgroundColor: colors.yellow,
  borderColor: colors.borderYellow,
  borderWidth: 1,
  alignItems: "center"
});

const CodeText = styled(Text, {
  fontSize: 20,
  fontWeight: "400",
  width: "100%",
  textAlign: "center",
})

// All 4 verfication code combined
const VerificationInputs = ({
  code,
  setCode,
  onCompleted,
}: {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  onCompleted: (code: string) => void;
}) => {
  const hiddenInputRef = useRef();
  const [isFocus, setIsFocus] = useState(false);

  const handleTextChange = (val) => {
    val = val.replace(/\D/g, '');
    setCode(val)
    if (val.length === 6) {
      onCompleted(val)
    }
  };

  const getBackgroundColor = (index) => {
    return code.length > index || (code.length >= index && isFocus)
      ? colors.borderYellow
      : colors.yellow;
  };

  const codeBlocks: Array<React.ReactNode> = []
  for (let index = 0; index < numInputs; index++) {
    codeBlocks.push(<CodeBlock
      key={index}
      onPress={() => {
        hiddenInputRef.current.focus();
      }}
      style={{
        backgroundColor: getBackgroundColor(index),
      }}
    >
      <CodeText>{code.length > index ? code.substring(index, index + 1) : ""}</CodeText>
    </CodeBlock>)
  }

  return (
    <XStack justifyContent="center" marginBottom="$2">
      <Input
        style={{
          position: "absolute",
          height: 0,
          width: 0,
          opacity: 0,
        }}
        maxLength={6}
        value={code}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
        ref={hiddenInputRef}
      />
      {codeBlocks}
    </XStack>
  );
};

let timer: NodeJS.Timeout | undefined;
// Main component
export function VerificationCodeScreen() {
  const [code, setCode] = useState("");
  const [sendCodeCD, setSendCodeCD] = useState(180);
  // const { isLoaded, signUp, setActive } = useSignUp();
  const [phoneNumber] = useParam("phoneNumber");
  const { push } = useRouter();

  if (timer) {
    clearTimeout(timer);
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

  const validateCode = async (code: string) => {
    // if (!isLoaded) {
    //   return;
    // }

    // try {
    //   const completeSignUp = await signUp.attemptPhoneNumberVerification({
    //     code,
    //   });

    //   await setActive({ session: completeSignUp.createdSessionId });
    //   setSendCodeCD(0)
    push("/onboard/enter-name");
    // } catch (err) {
    //   console.log("wrong code: " + code);

    //   console.error(JSON.stringify(err, null, 2));
    // }
  };

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
          onCompleted={validateCode}
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
            onPress={() => {
              validateCode(code);
            }}
          >
            Next
          </StyledButton>
        </FixedButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}
