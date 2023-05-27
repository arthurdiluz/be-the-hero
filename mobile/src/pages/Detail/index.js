import React from "react";
import { View, Image, Text, Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import * as MailComposer from "expo-mail-composer";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import logoImg from "../../assets/logo.png";

function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const incident = route.params.incident;
  const message = `Hello ${
    incident.ngo_owner.name
  }! I'm contacting you in order to support the '${
    incident.title
  }' case with ${Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(incident.value)}.`;

  function navigateBack() {
    navigation.goBack();
  }

  function sendMail() {
    MailComposer.composeAsync({
      subject: `Hero of the case: ${incident.title}`,
      recipients: [incident.ngo_owner.email],
      body: message,
    });
  }

  function sendWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=+${incident.ngo_owner.whatsapp}&text=${message}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <TouchableOpacity onPress={navigateBack}>
          <Feather name="arrow-left" size={28} color="#e82041" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.incident}>
          <View style={styles.incidentGroups}>
            <View style={styles.incidentGroup}>
              <Text style={[styles.incidentProperty, { marginTop: 0 }]}>
                CASE
              </Text>
              <Text style={[styles.incidentValue, { textAlign: "left" }]}>
                {incident.title}
              </Text>
            </View>
            <View style={styles.incidentGroup}>
              <Text style={[styles.incidentProperty, { marginTop: 0 }]}>
                NGO
              </Text>
              <Text style={styles.incidentValue}>
                {incident.ngo_owner.name} from {incident.ngo_owner.city}/
                {incident.ngo_owner.state}
              </Text>
            </View>
          </View>
          <Text style={styles.incidentProperty}>DESCRIPTION</Text>
          <Text style={styles.incidentValue}>{incident.description}</Text>
          <Text style={styles.incidentProperty}>VALUE</Text>
          <Text style={styles.incidentValue}>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(incident.value)}
          </Text>
        </View>
        <View style={styles.contactBox}>
          <Text style={styles.heroTitle}>Save the day!</Text>
          <Text style={styles.heroTitle}>Be the hero of this case.</Text>
          <Text styles={styles.heroDescription}>Get in touch through:</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
              <Text style={styles.actionText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={sendMail}>
              <Text style={styles.actionText}>E-mail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Detail;
