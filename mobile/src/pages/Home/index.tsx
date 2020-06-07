import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  Alert,
} from "react-native";
import api from "../../api";

interface IbgeUfResponse {
  sigla: string;
}

interface IbgeCityResponse {
  nome: string;
}

interface SelectItem {
  value: string;
  label: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [selectedUf, setSelectedUF] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    api
      .get<IbgeUfResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufs = response.data.map((uf) => {
          return { label: uf.sigla, value: uf.sigla };
        });

        setUfs(ufs);
      });
  }, []);

  useEffect(() => {
    api
      .get<IbgeCityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cities = response.data.map((city) => {
          return { label: city.nome, value: city.nome };
        });

        setCities(cities);
      });
  }, [selectedUf]);

  function handleNavigatoToMap() {
    if (!selectedUf && !selectedCity) {
      Alert.alert("Ooops", "selecione o estado e a cidade para continuar.");
      return;
    }
    navigation.navigate("Points", { uf: selectedUf, city: selectedCity });
  }

  function handleSelectedUf(uf: string) {
    if (!uf) {
      return;
    }

    setSelectedUF(uf);
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.select, , { marginBottom: 8 }]}>
          <RNPickerSelect
            placeholder={{
              value: null,
              label: "Selecione um estado...",
              color: "#ccc",
            }}
            onValueChange={(uf) => handleSelectedUf(uf)}
            style={{
              iconContainer: styles.selectIcon,
            }}
            Icon={() => <Icon name="arrow-down" color="#ccc" size={20} />}
            items={ufs}
          />
        </View>

        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{
              value: null,
              label: "Selecione um estado...",
              color: "#ccc",
            }}
            onValueChange={(city) => setSelectedCity(city)}
            style={{
              iconContainer: styles.selectIcon,
            }}
            Icon={() => <Icon name="arrow-down" color="#ccc" size={20} />}
            items={cities}
          />
        </View>

        <RectButton style={styles.button} onPress={handleNavigatoToMap}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  selectIcon: {
    top: 15,
    right: 10,
  },

  select: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 5,
  },

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
