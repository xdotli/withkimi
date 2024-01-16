import { styled, Button, YStack, Text, XStack, Input } from "tamagui";
import colors from "app/features/onboard/colors";

export const StyledButton = styled(Button, {
  width: 334,
  height: 50,
  paddingVertical: 10,
  borderRadius: 25,
  marginVertical: 5,
  fontWeight: "700",
  color: colors.white,
  variants: {
    cat: {
      primary: {
        backgroundColor: colors.primary,
      },
    },
  },
});

export const Container = styled(YStack, {
  flex: 1,
  justifyContent: "flex-start",
  padding: 20,
});

export const ContainerCenter = styled(YStack, {
  flex: 1,
  width: "100%",
  alignItems: "center",
});

export const HeaderText = styled(Text, {
  marginTop: 40,
  fontSize: 24,
  fontWeight: "700",
  marginBottom: 8,
  marginLeft: 5,
});

export const SubHeaderText = styled(Text, {
  fontSize: 16,
  marginBottom: 25,
  color: colors.gray,
  marginLeft: 5,
});

export const FixedButtonContainer = styled(YStack, {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 100, // Adjust this value as needed
  paddingHorizontal: 20,
  alignItems: "center",
});

export const InputContainer = styled(XStack, {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.borderYellow,
  borderRadius: 8,
  height: 50,
  backgroundColor: colors.yellow,
  marginHorizontal: 3,
});

export const CustomInput = styled(Input, {
  flex: 1, // Take up remaining space
  height: 50,
  marginLeft: 15,
  fontSize: 16,
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8,
});

export const HintText = styled(Text, {
  marginTop: 15,
  color: "#bbb",
  fontSize: 13,
});
