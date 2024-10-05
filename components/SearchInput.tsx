import { useEffect, useState } from "react";
import {
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { icons } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { fetchAPI } from "@/lib/fetch";
import { SearchInputProps } from "@/types/type";

const geoApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

const SearchInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  isHome,
}: SearchInputProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Fetch suggestions when debouncedQuery changes
  const fetchSuggestions = async (text: string) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    const response = await fetchAPI(
      `https://api.geoapify.com/v1/geocode/search?text=${text}&format=json&apiKey=${geoApiKey}&country=Vietnam&country_code=vn`,
    );

    setSuggestions(response.results);
  };

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <View
      className={`flex items-center justify-center relative z-50 rounded-xl py-1 ${containerStyle}`}
    >
      <View className="flex-row items-center w-full px-1 gap-2">
        <View className="justify-center items-center w-6 h-6">
          <Image
            source={icon ? icon : icons.search}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <TextInput
          className={`text-base h-10 font-semibold w-full bg-transparent ${textInputBackgroundColor}`}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
          }}
          editable={isHome}
        />
      </View>

      {suggestions.length > 0 && query && isHome && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handlePress({
                  latitude: item.lat,
                  longitude: item.lon,
                  address: item.formatted,
                });
                setQuery(item.formatted);
                setSuggestions([]);
              }}
            >
              <View className="flex flex-row items-center">
                <Image
                  source={icons.destination}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="p-2.5 bg-white">{item.formatted}</Text>
              </View>
            </TouchableOpacity>
          )}
          className="absolute top-14 w-full h-auto bg-white rounded-md pl-1 pr-3 z-[99] shadow-md"
        />
      )}
    </View>
  );
};

export default SearchInput;
