/** @format */

import { isEmptyObject, logDev, toFormattedLocaleName } from "app/frontend/sway_utils";
import { useCallback, useState } from "react";
import { sway } from "sway";
import { handleError } from "../sway_utils";
import { useCancellable } from "./useCancellable";
import { useLocale, useLocaleName } from "./useLocales";


const DEFAULT_LEGISLATORS = [] as sway.ILegislator[];

export const useRepresentatives = () => {
    const makeCancellable = useCancellable();
    const localeName = useLocaleName();
    const [locale] = useLocale();
    const userLocaleDistrict = ""
    const userLocaleRegionCode = locale.regionCode

    const [representatives, setRepresentatives] = useState<sway.ILegislator[]>(DEFAULT_LEGISLATORS);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isLoaded, setLoaded] = useState<boolean>(false);

    const handleGetLegislators = useCallback(
        async (isActive: boolean): Promise<sway.ILegislator[]> => {
            logDev("useRepresentatives.handleGetLegislators", {
                userLocaleDistrict,
                userLocaleRegionCode,
                isActive,
                district: userLocaleDistrict.replace(userLocaleRegionCode, ""),
                locale: localeName,
            });

            if (!userLocaleDistrict || !userLocaleRegionCode) {
                logDev(
                    "useRepresentatives.handleGetLegislators - NO userLocaleDistrict OR NO userLocaleRegionCode. Skip getting legislators.",
                );
                return [];
            }

            return [];
        },
        [localeName, userLocaleDistrict, userLocaleRegionCode],
    );

    const getRepresentatives = useCallback(
        (isActive: boolean) => {
            setLoading(true);

            makeCancellable(handleGetLegislators(isActive))
                .then((legislators) => {
                    logDev("useRepresentatives.getRepresentatives.legislators", legislators);
                    setLoading(false);
                    if (isEmptyObject(legislators)) {
                        if (isLoaded) {
                            console.error(
                                `No legislators found in ${toFormattedLocaleName(localeName)}`,
                            );
                        } else {
                            // no-op
                        }
                    } else {
                        setRepresentatives(
                            legislators
                                .sort((a, b) => (a.district > b.district ? -1 : 1)),
                        );
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    handleError(error);
                });
        },
        [makeCancellable, handleGetLegislators, localeName, isLoaded],
    );

    return { representatives, getRepresentatives, isLoading, isLoaded };
};
