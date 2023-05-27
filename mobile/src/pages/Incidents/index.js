import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import logoImg from "../../assets/logo.png";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation(); // navigate between screens

  useEffect(() => {
    loadIncidents();
  }, []);

  async function loadIncidents() {
    if (isLoading) return;
    if (total > 0 && incidents.length == total) return;

    setIsLoading(true);

    try {
      api
        .get("/incidents", { params: { page } })
        .then((response) => {
          setIncidents([...incidents, ...response.data]);
          setTotal(response.headers["x-total-count"]);
          setPage(page + 1);
          setIsLoading(false);
        })
        .catch((error) => {
          throw Error(error);
        });
    } catch (error) {
      throw Error(error);
    }
  }

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }

  function renderFooter() {
    if (!isLoading) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#e02041" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total of <Text style={styles.headerTextBold}>{total} cases</Text>.
        </Text>
      </View>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.description}>
        Pick one of the cases below and save the day.
      </Text>
      <FlatList
        style={styles.incidentList}
        data={incidents}
        keyExtractor={(incident) => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>NGO:</Text>
            <Text style={styles.incidentValue}>{incident.ngo_owner.name}</Text>
            <Text style={styles.incidentProperty}>CASE:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>
            <Text style={styles.incidentProperty}>VALUE:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(incident.value)}
            </Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>See more details</Text>
              <Feather name="arrow-right" size={16} color="#e02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default Incidents;
