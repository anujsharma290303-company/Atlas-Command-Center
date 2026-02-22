import type { AlertConfig } from "../types/alerts";

export const checkAlert =(
    config:AlertConfig,
    value:number
)=>{
    if(config.condition==="below"){
        return value<config.threshold;
    }
    return value>config.threshold;
}