import React from "react";
import { useLocalization } from "../localization";

export default function LanguageSwitch() {
    const { useEnglish, setUseEnglish, t } = useLocalization();

    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="langSwitch"
                checked={useEnglish}
                onChange={(e) => setUseEnglish(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="langSwitch">
                <span>{t("Čeština")}</span>
            </label>
        </div>
    );
}
