import React from 'react'
import { Redirect } from 'expo-router'

export default function () {
    return (
        <Redirect href={"/home"} />
    )
}
