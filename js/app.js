// ======== FIREBASE IMPORTS ========
import {
  fbRegister, fbLogin, fbLogout, fbOnAuthChange, fbSendPasswordReset, fbResendVerification,
  fbSaveScan, fbGetMyScans, fbDeleteScan, fbSoftDeleteScan, fbRestoreScan, fbGetDeletedScans,
  fbSaveReport, fbUpdateReport, fbGetSignature, fbGetMyReports, fbGetAllReports, fbDeleteReport, fbSoftDeleteReport, fbRestoreReport, fbGetDeletedReports,
  fbUpdateLocation, fbWatchLocations, fbGetAllLocations, fbWatchAllReports,
  fbGetAllUsers, fbGetVersionesObjetivo, fbWatchVersionesObjetivo, fbMarcarVersionesVistas, fbUpdateScan, fbReplaceScan,
  fbSaveViaje, fbUpdateViaje, fbGetMyViajes, fbGetAllViajes,
  fbSoftDeleteViaje, fbRestoreViaje, fbHardDeleteViaje, fbGetDeletedViajes,
  fbSaveServiceData, fbGetServiceData,
  fbSaveServiceReport, fbGetMyServiceReports, fbGetAllServiceReports,
  fbSoftDeleteServiceReport, fbRestoreServiceReport, fbHardDeleteServiceReport, fbGetDeletedServiceReports,
  fbSaveViaticoRendicion, fbUpdateViaticoRendicion, fbGetMyViaticos, fbGetAllViaticos,
  fbSoftDeleteViatico, fbRestoreViatico, fbHardDeleteViatico, fbGetDeletedViaticos,
  fbSaveViaticoGasto, fbUpdateViaticoGasto, fbDeleteViaticoGasto, fbGetGastosPendientes, fbMarcarGastosRendidos,
  fbSaveViaticoActivo, fbGetViaticoActivo, fbClearViaticoActivo,
  fbGetFlotaParametros, fbSaveFlotaParametros,
  fbSaveFlotaVehiculo, fbGetFlotaVehiculos, fbDeleteFlotaVehiculo,
  fbSaveFlotaGrua, fbGetFlotaGruas, fbDeleteFlotaGrua,
  fbSaveFlotaEvento, fbGetFlotaEventos, fbDeleteFlotaEvento
} from './firebase.js';

// ======== DANAIDE LOGO (embedded) ========
const DANAIDE_LOGO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAB7AZoDASIAAhEBAxEB/8QAHAABAAMAAwEBAAAAAAAAAAAAAAYHCAEEBQID/8QAXxAAAQMDAgIEBwgJDwYPAQAAAQACAwQFEQYHEiEIMUFRExQiYXGBkRcyN5Shs9HSFRYjUlVydbGyNkJGVFZic3SChZKTo8HCGDNTZIOiJCUmJzQ1Q0RFY2VmhMPT4f/EABsBAQACAwEBAAAAAAAAAAAAAAADBQIEBgEH/8QAQBEAAQMCAQcJBAgFBQAAAAAAAQACAwQRBRITITFBUWEUMnGBkaGxwfAGItHhFTM1QlNUcvEjNFWS4iU2Q1Ji/9oADAMBAAIRAxEAPwDZaIiIiIiIiIoneNx9F2m5TW6vvbY6mB3DKxtPLJwu7RlrSM+tSRxPkNmAnoUE9TDTjKmeGjiQPFSxFCPdZ2//AA+fic/1E91nb/8AD5+Jz/UUvI6j8M9hWr9L4f8Ajs/ub8VN0UI91nb/APD5+Jz/AFE91nb/APD5+Jz/AFE5HUfhnsKfS+H/AI7P7m/FTdFCW7saAJAF/wCvvo5x/gXr2rWuk7o9rKHUFBLI7qYZQ1x/kuwVi6mmaLuYR1FSR4lRynJZK0ng4HzXvouGOa9ocxwc08wQcgrlQLdRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERZSmtLL7u5W2iWZ0LKu8TxukaMluZHc1q1Zj098Pf8+T/ADj1dYQ4tErhrAXG+1sbZHUrHC4L7HuU79we1/h+s/qW/SnuD2v8P1n9S36V3OkNqO8WSgtcFprZaPxiR5kfEcOIaBgZ7uarOgr906+kjq6KXUFRTyDLJI2uLXDq5HC2Kfls0QlzoAO/9lXV4wakqnUwpC5zbXtfb1qwPcHtf4frP6lv0p7g9r/D9Z/Ut+lQbj3d+91J/Vu+hcGTd7sZqT+rf9ClyKv8cdy1s9hP5B/f8VOJNhrcWng1DVh3ZmBpH514N42JvUTC+2Xejqj2MlaYz7ea8J1XvBT/AHQN1Ny7oHu+QAr6tu72u7LUeL18kVWWHy4a2n4Xj1jhI9azayvGlkrXeuhYvkwI6JaZ8fHT8fJdF1VuPt1UtEjrhQQ5AaJPutM/HYOtvswR5lam3m8tqvcsVvv8cdrrn4a2Xi+4SO9J95nz8vOuzpDdjSuq4xbLzBHbqibyTDVEPhkPcHEAeogKM7qbMs8HNd9IRkEZfLb85B7zGT1fi+zuWvI+Kd2aq2ZD949fFWNPDU0cfKMLmzsY1tOsfPsPAq8wQRkHIKLOuy26VRZ6yLTWpppHULn+DgqJSeOmdnHC7PPgzy/e+jq0UCCMg5BVPV0b6V+S7qO9dXhmJw4jDnI9BGsbQUREWqrJERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERFmTT3w9/z5P849abWY9PfD3/AD5P849XGFcyb9K4/wBqvraT9Y8lMelF/mrH+NL+Zqm+0c8VLtVa6md3DFDTPke7uaC4kqD9KM4hsf40v+FSjQxHuENLhkfYuoyPU9ZSC+HxDj8VjTOLcfqnDYweDV4M2/VpEjhFp+uezPkl0zGkjzjnj5V+Pu+2/wDc3VfGW/QoJsXp+1al1fUUF4pvGKdlC+VreIt8oPYAeXmcVdR2m0If/Bv7Z/0qeqjw+mkzb2G/T81q4bUY7iMOfjlaBcjSB8FFIN/bOZAKjT9exnaY5WPPsOPzqQW7X23Wtoxb650Ie/kKe5Qhh59zubc+gr6qNm9Byh3DbqiIntZVP5e0kKA652KqaWnfWaVrHVnDlzqSowHkfvHDkT5jj0qJgw6U2YSw7/V1uPdj1O0ula2Vu0DX4DzXY3N2VDIZLro/icGgukoHuySO+N3+E+o9i8vZbdGpstZDpnUsr3W8u8FBPKfLpXDkGOz+s7P3vo6vy2h3Pr9N3FundUyzut5f4Nr58+Eo3dxzz4PMer0L2ukfoSE0jtaWeFoII+yDYxyc08hLy8+AfSD3rc97K5JV6Qea5VwbHknEsM91zeezht0bv3FiFx0ktCwNpjrS1RNaeJrbgxg5OzgNl9OcA9+QV6/Rv1zJebU/TFzmL66gZxU0jjzkg5DB7y09vcR3Lr7N6hGtNsrtpK7S+Gq6SkfAHPOXPhc0hhz3tPL1BURorUFRpnVVuvkBcTTTB0jAffxnk9vrblex0z56eSlk0uZqPgspa2OkrIq+DQyUe8OO3s8elbgRfFPNFUU8dRC8PilYHscOpzSMgr7XLLv9aIs0dJ3UOoLXuPT0trvt1oIDbInmOmrJImlxkkBOGkDPIc/MotbbfvPcrfBcKCq1dUUs7BJFKy4ykPaeojy1cxYQXxNldIADvXPT4+I53Qtic4t3LYCLHtbcd49MvFXX1+rKZoBPHUzSyxj08Rc32qZ7e7/XCCoio9YwNqqYkNNbAzhkZ++c0ciOvOMHuCSYLMG5cbg4cF5F7SU5fm5mlh4haPRfjQVdNX0UNbRzx1FNOwPiljdlr2nmCCv2VMRbQV0IIIuEREReoiIiIiIiIiIiIiIiIiIiLM2+mpNV0m4lXSC6XCgpoWt8VjgndG1zCB5XkkZyc8z3K/8AQlVc63R1qqrxG5lfLTNdOHN4TnHWR2EjB9a9Welpp3MfPTwyuYctL2Bxb6M9S/Vb1RVtmhZGGWLdqp6HDJKaqlndKXB+zdp6dmoIiItFXC69xraW3UM1dWzNhp4GF8kjupoHaozp/cbS1/v8dltFVPVVEjXODhC5rAGjJ5ux8i/fdj4OL9/E3Khujx8J1J/ATfoFWlLRRy00krr3bq7FzmJ4vNTYhBSsAyX2vv120LUCIiq10aIiIiIiIiIiIiIiIiIiIiIiIiLMenj/AM/gH/rs/wA49acWYNO/D9/Ps/zj1c4TzJv0rkfagXlpP1jyUx6UxxFYvxpv8KlOh/gFb+Sqj9F6ivSpOIbF+NN+ZqlOhvgEb+Sqj9F6zf8AyEP6vMrCEf63VH/x5NVadGE51/WfkyT5yJaRWbOi6Cdf1jschbHj+0jWk1Fjf80egLZ9kBbDR0lERFULqFQ/Sg0hC2mp9X0MIY/jEFcGjk4H3j/TnyT35HcpNsRdmau2vks10PhzSB1DKH8+KIt8nPoacepSTeWGOfa7UDZBkNo3PHmLcEfKFVPRKqGxzam8LKGRMjp5HOc7DW85Mkns6vkV4xxmw0l2thFu74rlHxNpcbbkapWm47fh4qu9OXmq2817c2Djd4u2qopGffnhcGZ/lhh9GVC+F3BxYJaDgnsypRupW0V53LvNXZXmqpqmqHgXMafujsNB4R25dnHem4lsj01Ha9McTH11PAaq5OaeqolxiP8AkMaz1ud3rpYnC7SR7zgL9Q+dlxk0brPYDdjCbdZ2dIF+paf2OuZuu1tkne9z3xwmBzieZLHFv9ymqqvouSOftcxhPksrJg30ZB/vVqLiK5gZUPaN5X1DDHmSjicf+o8FlXpYfChT/kqH5yVX7s18FWmvyfH+ZUF0sPhQp/yVD85Kr92a+CrTX5Pj/MrWv+z4fWxUuGfa1T63KWPa17S17Q5pGCCMgrN3SV28t9kbDqqx0opqeom8FWQRjyGPcCWyAfrQcYPZkjvWklA+kBFHLtHfBKBhrI3jP3wkaR8oVfhtQ+GpbknQTY9as8apY6ijflDSASOBCg/RN1HNU2u46ZqJS5tGRUUwJ96x5PE0ebi5/wApSvf2q1ZHYKCi0fDdH1tTU5lfQxvLmRtaetzfegkjr61UXRScRuZUtHU61y5/rIlqGrqaekp31NXPFTwsGXySvDWtHeSeQW3iWTT1+WG3224qvwbKq8KEbnZOsX22Hy0LJ8ujd5Zszy0l/eTzJdXDPs48row6v3L0VcGw1Vfd6ORpz4vXsL2PGefJ4OR5x6itKz7m6BheWP1VbiR948uHtAIUH3u1JoPVO3lbFS323VVfTFs1IGvxJxAgEAHnzaSMfQt2CulleGTQDJPA+arKrC4IInS09UcoC/OGnsspbs/uBT67sb5JImU1ypSG1ULTkc+p7e3Bx6updPf7Vd20no+GpstS2mrKiqbE2UxteWjBJwHAjs7Qql6KU0jdw62APIjfbJHOb2EiSPB+U+1TjpZ/qPtH5Q/+ty1X0ccWJNjA906bLeZiM0+CvnJs8Ai/XrVR0V73O1a6YUNfqG5tjI8L4sXlrM9WeHk3OD7Cu4NN7tUrPGW0OpW8HlZbK8u9gdk+xWN0SGgWW/v7TUxD2NP0q8VsVmJ8mmdEyMWC0cOwIV1MyolmdlO48VlrQW7+qLFeIqa/1s1xtvhOCoZUtzLEOolrvfZHcc9WOS1FBKyaFk0Tg5kjQ5pHaCMhZJ3+pIaTdi8NgaGNlMUxAGBxOjaXH1nJ9a0ztrNJPt9YJpXFz326EuJ7TwBa+LQxmKOdjbZXwutv2cqZxPNRyuLsg6CeBsqd3RZudfdbXGGwUt+ZaonNihETnQxPw0ZcCSAcnPNRCo0vuzb2Gpko9QDg5kxVJkPsa4lafvd/slkYH3e60dCCMtE0oaXDzDrPqXhjczQZdwjU9Dn0ux+ZeQYhM1gbHCCBwKVmC0r5XPmqSHE35wFupUVoreDVdguDIb1US3Wga7hmhqB92YO0tf15Hc7I5Y5da01a66ludtp7hRSiWmqI2yRPHa0jIWY+kFPpuv1XTXXT1bS1XjcGao07gRxtOATjtI/Mrm6PkjpNprSHEngdO0Z7vDPWWKQRugZUNbkk6CPXQovZ6rnZWS0MkmW1ouDe+749SqvefWWqbVuFcqG236upaZnBwxRy4a3LBnC0Lp2WSfT9ummeXySUsTnuJ5uJYCSVl3fv4ULp/s/0AtJUNWaHb+nrhjMFrZIM94iBCxxCJopockaSPILPA6h5r6sPcSGnfq0lVbvFuzXUN0n0/peZsL6dxjqazhDnB45FjM8hjqJx19XeoBardubqxprqE3utjef88+pMbHehznAH1LwtJ0B1FrO3UNQ4nx6saJiOsguy75MrZFLBDS00dNTxNihiaGMY0YDQOoLaqZY8MY2ONgLjrJVXh9PP7QyyTzyFrAbAA+hoG22lZcvNDunYbNVU90ZeW22aMtqA6QVEQaevJBcG+nkv36PHwnUn8BN+gVfO7HwcX7+JuVD9Hf4TqX+LzforOGqNTRSuLQDp1dChqsOFBi9NG15cCQdJvbStI3660dks9VdbhKIqamZxvd8gA85JAA7ys4an3O1hqa7eL2mepoqeR3BBR0YzI7uy4Dic49w5eZWH0nLhLBpO32+Nxayrq+KTHaGNyAfWQfUodsDcdK2Spr7tfbjT0tZ5MNMJQSQ0jLnDA5dgWrh8DIqY1JZlO2Bb+O1s1TiLcPZLm2Wu43tsvr6NQ3ryptKbqwUprpKW98AHF5NXxSf0A8uz6l6+3G7F5tt1hoNSVbq23SO8G6Wb/OwHPvuLrI7wfb3297o2h/3SUXtd9Cz9vBUWSs1zVVthninpahjZHvi96ZCPKWzTyOrSYp4rbjayrcRgZg4bU0NTlG4uC4G/UNnq61W0hzQ5pyCMgrlRzbCrfXbfWOokcXP8TYxxJySWjhyfPyUjXNSMyHlp2L6PBKJomyD7wB7UREWClRERERERERERERZTorjR2re+a410wipYL3O+STBIa3wj+fJasVOXrYynuV5rridQyxmqqZJ+AU4PDxuLsdfZlWuF1EMWWJTYEWXNe0VDVVWZdTNuWOvrUV6QurbBqRlobZLgyrMBlMnC0jhzw46x5lINJa+0pR7PCy1N2ZHXtt80PgSx2eMtdgdWOeQvk9H6mP7JJviw+lfJ6PlMf2SzfFh9K3zLh5hbDlmzTfV8lTtpsbbVSVWablPFjpFtnHgoT0ftQWfTusKusvVYykhkoXRskeDgu42HHLzA+xXod09BAZ+2Kl+X6FX56PVMf2TTfFh9K4PR4pj+yaf4sPpWNU/D6mTOOkIPR8lNhsWNYfAIGQtI4kbetT526+gGtJOoqf1Ncf7l59bvXt9TNdw3OoqHD9bFSvOfWQB8qiA6O9ISOLU1RjzUzfpXbpujxp9uDUX25yEHqa1jR+Za+awsa3uProVjyjHXaomjr+a8LcXfO2XzTlwsdpsdZwVsLoTPUyNYWA9oa3iz7Qqg0zRaju757Np+CtqfGuHxiGnzwvDc8PGerAyevktFnbfaPS7TU3mandw8j49W8s/igjmvB1NvZpXTtA+16As0Ejm5DJRTiCmae8NGHO9g9JVhS1DGtzdHETfadXrsVTW0Uj5BLiM4Fhazddt3q68+06XtGz9i+2zVTqev1G5pFuoGOy2OTsOe0jOS7qHZk4zRt4uNXdbpU3KulMtTUyulleT1uJypjRWjVG4lxqdT3+ufDbIQX1l0qjiKGNvWyMdp6wGt7TzxnKiFwFPXXp0VmpZWQSyiKlidze7qa3P748s+cqzpGZL3F7sp+07Bw9daqK52XGxsTcmP7o2ne4793cFq/o1Uj6Xaa3ukYWunllm5jrBecH2AKyl5WkLSyxaXtlnYBijpmRHB7QOfy5XqriamTOzOeNpK+lUcOZp2RnYAO5ZV6WHwoU/5Kh+clV+7NfBVpr8nx/mVBdLD4UKf8lQ/OSrs6P34q9O6Xt1jZpyGobQwNhEpqS0vx244eS6GaklqaCFsQuQuUgr4KLFKh0xsDwJ8FqFUz0qdTU9HpGHTMUrXVlwmZJKwfrYWHiye7Lg3HoKg986Q2pqqmMVstdBbnn/tSTK4egHAz7VD9MaR1puNfXVXBVzmd4dUXKrz4NoPbxHr5dTW/IFDRYU6neJ6khobpUuJY4yriNNRguc7Rq2bVYXRHsz33a8X9zcMihbSRnvLiHO/Raor0hdUV9819W2ySVzbfbJPAQQA+SXAeU8jtJOefYFprQumaDSOmaWx24Exwgl8jvfSvPNzz6T7BgdizH0g9MXCybg19xlgcaC5yeHp5wPJyR5TCexwOeXdgqWhqY6nEHyHdoWvitHLRYQyJu/3rcb911K9LdHyrr7TT1131C2jknYJPF4abwhYCMjLi4c8dmPWutr7Y+LTOlq6/RalfUikj4/Auog0v5ge+4+XX3FdzS3SCmobTBR3iwmrlhjbH4aCfh4wBjJBB5rqbib3Q6m0tW2Kk0++nFWwMdLLUBxaMg5AA8ykacUz4yubfha3ioZBgIpTk862jnXvbs19S6XRU+Eqq/JUvzkSnPS0/UpZv4+fm3KEdFJpO4tY8AkNtkgJ7syR/Qpt0tP1K2b+PO+bco6j7WZ1eBWdJ/t+Tr8QvnolD/k1ez/rrP0ArsVKdEr9TF6/jrfmwrrVRiv82/1sXRYB9nRdHmVk/pGjG7FxPfDAf7MK8LXenad2Fob1G0OlpbLE6IHq4ywBufNxEKkOkf8ACvX/AMBB82Fd9ssr9RbCUVlic1s1VZYmxFxwPCBgLc+biAVpWZPJafL1aL9Flz+GZf0hW5vne9bpubLOWmLNetwdY+KeOCWuqi6WepqHE4aOsn+4egclbUXR5gEQEmq5S/tLaEAezjVTaWvN42/1gK00ZjrKbiimp5wRxNPIj5OsK3YekJQmIeF01U+Exz4aluM+xblea7KHJubbZbzVVhAwkxu+kPrL7cry77qtd2NB/aJX0NL9lfsh43E6Ti8X8FwYIGPfOz1q+Ojv8E9s/hJ/nnqhd19dO11dKSr+x4oo6WJ0bG+E4y7Jzk8gr86PbcbS2g4986oP9vItXE87yFme519PfuW97P8AJvpiXkv1eSba97d+nWqO37+FG6f7P9ALRXgjVbWtiZyMlmaG+uELO2/gxuldB5oz/uBaa0gA7SFnBAINBACD2/c2qDETk00B9agtrAm5eIVjTtPmVlPaqqjotxLDUTENY2ra1xPZxZb/AHrYKyfuvo24aQ1PPLFHL9jZpjLR1Dc4bk54CexzTy8+MqZ6U31npLbDS361PrZomhpqIZA1zwO1wPLPoU+JUr60Mng06Fo+z+Ix4Q+WjrPdN73t1fsrU3bdw7a34/6o4fKFRXR2BO5tMe6mmP8Aur3de7y0l/0zW2aiss8PjcfgzLNKPJGR2BeX0aoDLuHJLgkQUMjye7LmN/vXlPTyU9DKJBYm/gva+ugr8ZpnU7soC3jdTPpRwPdYbNUAeQyqexx87mZH6JVbbZ6CdrZtYIbxDRTUpbmN8JeXNOfK5EdowtF7h6bi1XpOrs73NjleA+CQjPg5GnLT6OsHzErMVPNqbb/VHGGzUFfA7DmuB4JW9x7HNP8A/eRXuGTOkpTFE6zxqUXtJSMgxNtVUsLonWvbot27eKsYbCVwP6pab4o76y59wWu/dJT/ABV31l+9t36IixcNPcUg/XQVGAfUQu5bt5qy9XuitVo081ktVO2IOmm4uEE83YAHUOawc/FW3vs/SpGQ+y77BuknZ791Z2kLR9gNM2+z+GExpIRG6QNwHHtOOznleqg6uaLnnOLnFx1lfQI42xMDG6gLDqRERYrNERERERERERERFmfVFz3aZqW6softp8VbWzCDwVNIWcHGeHhw3qxjC0wqlu++tgtt2rLdLZro+SkqJIHOaY8OLHFpIy7q5Kyw0yBzsiMP6diocdZC9jM7OYtOzaquN23m/wDd3xWX6q+Td95+z7bvikv1VZH+UJpzPOx3f1eD+suD0htM/gO8f2X1lb5dT+WHcucFPRfn3dpVbG770j91/wAUl+qvk3jevu1f8Tl+qrKPSH0z+A7x7Ivrrj/KJ0x+Arz7Ivrr3OVP5YdyzEFH+ed2lVm6672P8nGsv5NJMPzNX5OtO898PBLTark7MVD5IR/vloVmy9IvTgH3PT92cf3zox/iK8O7dJCpMbm2rS8TH48mSpqi4A+drQM/0lmx1YT7tO0di8fFQAe/WOcNwv8ANR+07E68uk4lu8lHbg4+W6eo8NJ6cMyD/SUjqdA7XbcwtrdZ3d95rwA6OhBxxuHdG05Iz98eHvUIum6+5erajxGgnljc8H/g1qpTxEH+k/5V1Kzbq42m3m/6+uH2IhlOWwOeJq2pf3Nbnr7y48u1SubUOIFRKG32N1nzUbDRtBdSQl5H3n6h5dtl19zdx7lrBzKCnhZa7DTkeLW+AAN5dTn46z5uodneZH0ZNGuvusPtgq4S6gtDg9pI5Pnx5A/k++9PCoLo3S9frPVEdpsdM6Nj3Ze954m08f3z3csn2ZPUAtm6K03btJ6cpbHa2EQwN8p7vfSPPvnu85KjxOqjo4MxFoJ7h8SpsFopcQqeVT6Wt7zsA4D5L2URFyK71R3Umh9J6jr2198sdNXVLYxE2STOQ0EkDke8n2roM2u2+Z1aTtp/GjJ/OVMUUwqJWiwcbdJUDqWBzspzAT0BR6h0Po2hmbNSaWs0MrTlr20bOIevGVII2MjYGRtaxo6g0YAXKKNz3P5xupGRMj5gA6EXXuFFR3CkfSV9LDVU7xh8UzA9rvSCuwi8BtpCyIBFioNW7Rbc1cxll0zAxx7IZ5Ym/wBFjwPkXNDtJt1RyiSLTMD3DsmmlmHse4hThFPyyotbOHtK1Po6kvfNNv8ApHwXTtdqtlqh8DbLdSUUf3sELWD5Avxv9gs1/gigvVtp6+KJ3HGyZnEGuxjI9S9JFCHuDsq+lbJjYW5BAtu2LzLBYLLYIZYbLbKagjlcHSNhZwhxxjJXpoi8c4uNyblesY1gyWiwXhXfR2lbvXvr7pYLfWVTwA6WaEOcQBgcz5l69FS01DRw0dHCyCnhYGRRsGGsaBgADuX7IsjI5wAJ0BYtijY4ua0AngvI1BpnT9/aBebPRVpAw18sQL2jzO6x6io0dntuSc/a8fVXVH/6KeIs2VM0Ysx5A4EqGWhppnZUkbXHiAVFrTt5om1vD6PTdAHt6nysMrh6C8kqTxsZFGI42NYxowGtGAF9IsHyPkN3knpUsUEUItG0NHAWXhXTR2lrpXSV1xsNBVVMmOOWWEOc7HIc17VPFFTwRwQRtjijaGMY0YDWgYAC+0XjnucACdS9ZDGwlzWgE69C/Krpqerp3U9VBFPC8YdHIwOaR5wVEK7arQNZM6WTTsUb3f6GaSJv9FrgPkU0RZRzSR8xxHQVHPSQVH1rA7pAPioRR7T6AppBI2wNkcP9LUSvHsLsfIpXa7XbbVD4G2W+loovvIImsHsAXcReyTyyc9xPSV5DRU8BvFGG9AARdO7Wm2Xan8XulvpqyL72aMPA9GepdxFGCQbhTua14yXC4UJl2o0BJIZHafaCevhqpmj2B+F6lh0RpOx1LKm12OmhnZ7yV2ZHt5Y5OcSRyUiRTOqpnCznkjpK1GYbRxuy2RNB3hov4IiIoFuoiIiIiIiIiIiIiIiIq7uW0+3tdcKqtqqWQ1FRM+WU+OvGXucS7lnlzJViLMmqtm9dV+p7rXUtLRugqa2aaImraCWukcRy7ORCscPblOd/Fzfn3hUuMuLWNtT53Tq3dxVn+45tr+1JPj7/AKy49xvbT9pyfH3/AFlTp2P3Cz/0Si+ONXw/Y/cMHlQUbvOKxitc2Pznf81QiV39OHZ/irk9xnbP9pyfH3/WT3Gdsv2nJ8ff9ZUwdjtxCf8Aq+k+Os+lcHYvcU/9yoh/8xqZsfnO/wCazErv6cOz/FXK/Z7ayIF0tMGgdfHcXgfpLrVVq2N0yOOqbYjI3ygHS+Hf6hkqpW7Dbhvdh0FuaO91YMfIF7Fo6OWppn/8aXy1Ucf/AJAfM72EMHyleFkI+sqiRw/cqRklR/xUIB42+AXrao34s9rp32/QFghjB5eMzQiKMedsbebvS7HoKgel9Ia33Yvxu1bPMad5xLcakfc2NB97G3lnHcOXeQrw0fsbouxytqK6KW9Tt5jxzBjB/EHI+vKtCGOOGJkUMbY42ANaxowGgdQA7AoHYjT0wIpG6T94+vW5bTMIqqxwdXP90fdbq9dp4qP6B0dZtF2RtstEJGfKmnfzkmd984/mHUFIkRUb3ukcXONyV0kcbImhjBYBERFis0RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERF//2Q==';

// ======== OFFLINE QUEUE ========
const QUEUE_KEY = 'scancheck_sync_queue';
function queueGetAll() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch(e) { return []; }
}
function queueSave(items) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); } catch(e) {}
}
function queueAdd(type, data) {
  const items = queueGetAll();
  if (!items.find(i => i.type===type && i.id===data.id)) {
    items.push({ type, id: data.id||data.fbId||Date.now(), data, ts: Date.now() });
    queueSave(items);
  }
}

async function processSyncQueue() {
  if (!navigator.onLine) return;
  const items = queueGetAll();
  if (!items.length) return;
  setSyncStatus('syncing');
  let remaining = [];
  for (const item of items) {
    try {
      if (item.type === 'scan') {
        const fbId = await fbSaveScan(item.data);
        const si = localScans.findIndex(s => s.id === item.data.id);
        if (si !== -1) localScans[si].fbId = fbId;
        // Subir fotos a R2 que quedaron pendientes por falta de conexión
        // Las fotos pueden estar en item.data.photos (si se guardaron en la cola)
        // o en localStorage con la clave scancheck_photos_{id}
        let photos = item.data.photos || [];
        if (photos.length === 0) {
          try {
            const stored = localStorage.getItem('scancheck_photos_' + item.data.id);
            if (stored) photos = JSON.parse(stored);
          } catch(e) {}
        }
        if (photos.length > 0 && fbId) {
          uploadPhotosToR2(fbId, photos).then(async urls => {
            if (urls.length > 0) {
              if (si !== -1) localScans[si].photoUrls = urls;
              try { await fbUpdateScan(fbId, { photoUrls: urls }); } catch(e) {}
              console.log(`✓ ${urls.length} foto(s) sincronizadas a R2 (offline→online)`);
            }
          }).catch(e => console.warn('Error subiendo fotos offline a R2:', e.message));
        }
      } else if (item.type === 'report') {
        const repFb = {
          ...item.data,
          scansSnapshot: (item.data.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
        };
        const fbId = await fbSaveReport(repFb);
        const ri = localReports.findIndex(r=>r.id===item.id);
        if (ri>=0) localReports[ri].fbId = fbId;
      } else if (item.type === 'viaje') {
        // Sincronizar viaje de km que no llegó a Firestore por falta de conexión
        const fbId = await fbSaveViaje(item.data);
        const vi = localViajes.findIndex(v => v.id === item.data.id);
        if (vi !== -1) {
          localViajes[vi].fbId = fbId;
          if (viajeAbierto?.id === item.data.id) viajeAbierto.fbId = fbId;
          try {
            const stored = localStorage.getItem('scancheck_viaje_abierto_'+item.data.userId);
            if (stored) {
              const v = JSON.parse(stored);
              if (v.id === item.data.id) {
                localStorage.setItem('scancheck_viaje_abierto_'+item.data.userId, JSON.stringify({...v, fbId}));
              }
            }
          } catch(e) {}
        }
        console.log('✓ Viaje km sincronizado a Firestore:', fbId);
      } else if (item.type === 'programacion') {
        // Sincronizar viaje programado nuevo
        const fbId = await fbSaveViaje(item.data);
        const vi = localViajes.findIndex(v => v.id === item.data.id);
        if (vi !== -1) {
          localViajes[vi].fbId = fbId;
          try {
            const stored = localStorage.getItem('scancheck_viajes_programados_'+item.data.userId);
            if (stored) {
              const arr = JSON.parse(stored);
              const pi = arr.findIndex(v => v.id === item.data.id);
              if (pi !== -1) { arr[pi].fbId = fbId; localStorage.setItem('scancheck_viajes_programados_'+item.data.userId, JSON.stringify(arr)); }
            }
          } catch(e) {}
        }
        console.log('✓ Viaje programado sincronizado a Firestore:', fbId);
      } else if (item.type === 'programacion_update') {
        // Sincronizar actualización de viaje programado
        const { fbId, id, ...datos } = item.data;
        if (fbId && !fbId.startsWith('pv_')) {
          await fbUpdateViaje(fbId, datos);
          console.log('✓ Reprogramación sincronizada a Firestore:', fbId);
        }
      } else if (item.type === 'programacion_estado') {
        // Sincronizar cambio de estado de viaje programado
        const { fbId, id, ...datos } = item.data;
        if (fbId && !fbId.startsWith('pv_')) {
          await fbUpdateViaje(fbId, datos);
          console.log('✓ Estado de viaje programado sincronizado:', fbId, datos.estado);
        }
      }
    } catch(e) {
      console.warn('Sync queue item failed:', item.type, item.id, e.message);
      remaining.push(item);
    }
  }
  queueSave(remaining);
  setSyncStatus(remaining.length === 0 ? 'ok' : 'error');
  if (remaining.length < items.length) {
    // Persistir los fbId recién asignados, para que el borrado funcione bien
    // en la misma sesión sin necesitar otra recarga de página.
    try {
      const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
      localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
    } catch(e) {}
    if (currentPage === 'history') renderHistory();
    if (currentPage === 'supervisor') renderSupervisor();
    showToast('✓ Datos sincronizados con Firebase', 'success');
  }
}

window.addEventListener('online', () => {
  setSyncStatus('syncing');
  showToast('Conexión restaurada — sincronizando...', 'success');
  setTimeout(processSyncQueue, 1000);
});
window.addEventListener('offline', () => {
  setSyncStatus('offline');
  showToast('Sin conexión — guardando localmente', '');
});

// ======== LOCAL STATE ========
let currentUser = null;
let currentPage = 'home';
let pageHistory = [];
let currentReport = null;
let viewingReportId = null;
let modalScanId = null;
let editingScanId = null; // ID del scan que se está editando (null = registro nuevo)
let localViajes = []; // viajes del técnico actual
let viajeAbierto = null; // viaje en curso (sin fecha de llegada)
let cameraStream = null;
let qrStream = null;
let capturedPhotos = [];
let currentOpType = 'mantenimiento';
let currentLocation = null;
let sigCanvas, sigCtx, sigDrawing = false, sigHasDraw = false;
let overlayTimer = null;
let qrScanning = false;
let qrAssureEngine = null, qrAssureDocLib = null, qrAssureLicKey = null;
let qrDatosSistema = {}; // campos nuevos del ps1 v2: disco, USB, uptime, actualizaciones
let localScans = [];
let localReports = [];
let unsubLocations = null;
let unsubReports = null;
let locationUpdateTimer = null;

// ======== INIT ========
window.addEventListener('DOMContentLoaded', () => {
  initSignatureCanvas();
  requestLocation();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Detectar cuando hay una nueva versión del SW disponible
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // Hay una versión nueva activa — avisar al usuario sin forzar recarga
            showToast('Nueva versión disponible — recargá para actualizar', 'success');
          }
        });
      });
    }).catch(() => {});
    // Detectar si el SW controló la página (puede causar recarga en algunos casos)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed — nueva versión activa');
    });
  }
  // Check if we returned from QR scanner page
  const qrResult = sessionStorage.getItem('scancheck_qr_result');
  if (qrResult) {
    sessionStorage.removeItem('scancheck_qr_result');
    // Process after app loads
    setTimeout(() => processQRData(qrResult), 1500);
  }

  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade-out');
    setTimeout(() => splash.classList.add('hidden'), 600);
  }, 1800);

  // Firebase auth state listener — this is the main entry point
  fbOnAuthChange(user => {
    if (user) {
      currentUser = user;
      document.getElementById('login-page').classList.add('hidden');
      startApp();
    } else {
      currentUser = null;
      document.getElementById('app').classList.add('hidden');
      document.getElementById('login-page').classList.remove('hidden');
      setLoading('btn-login', false, 'Ingresar');
    }
  });
});

// ======== AUTH ========
async function doLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass  = document.getElementById('login-pass').value;
  clearLoginError();
  if (!email || !pass) { showLoginError('Completá todos los campos'); return; }
  setLoading('btn-login', true, 'Ingresando...');
  try {
    await fbLogin(email, pass);
    // onAuthChange handles the rest
  } catch(e) {
    setLoading('btn-login', false, 'Ingresar');
    showLoginError(firebaseErrorMsg(e.code));
  }
}
window.doLogin = doLogin;

async function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass  = document.getElementById('reg-pass').value;
  document.getElementById('reg-error').classList.add('hidden');
  if (!name || !email || !pass) { showRegError('Completá todos los campos'); return; }
  if (pass.length < 6) { showRegError('La contraseña debe tener al menos 6 caracteres'); return; }
  setLoading('btn-register', true, 'Creando cuenta...');
  try {
    await fbRegister(name, email, pass);
    showToast('✓ Cuenta creada. Revisá tu email para verificarla.', 'success');
    // onAuthChange handles the rest
  } catch(e) {
    setLoading('btn-register', false, 'Crear cuenta');
    showRegError(firebaseErrorMsg(e.code));
  }
}
window.doRegister = doRegister;

async function doLogout() {
  toggleMenu();
  if (unsubLocations) unsubLocations();
  if (unsubReports) unsubReports();
  clearInterval(locationUpdateTimer);
  await fbLogout();
}
window.doLogout = doLogout;

function showLoginError(msg) { const e = document.getElementById('login-error'); e.textContent = msg; e.classList.remove('hidden'); }
function clearLoginError() { document.getElementById('login-error').classList.add('hidden'); }
function showRegError(msg) { const e = document.getElementById('reg-error'); e.textContent = msg; e.classList.remove('hidden'); }
function showRegister() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden'); }
function hideRegister() { document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden'); }
window.showRegister = showRegister;
window.hideRegister = hideRegister;

function showForgotPassword() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('forgot-form').classList.remove('hidden');
  document.getElementById('forgot-error').classList.add('hidden');
  document.getElementById('forgot-success').classList.add('hidden');
  const le = document.getElementById('login-email').value;
  if (le) document.getElementById('forgot-email').value = le;
}
function hideForgotPassword() {
  document.getElementById('forgot-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}
window.showForgotPassword = showForgotPassword;
window.hideForgotPassword = hideForgotPassword;

async function doForgotPassword() {
  const email = document.getElementById('forgot-email').value.trim();
  const errEl = document.getElementById('forgot-error');
  const okEl  = document.getElementById('forgot-success');
  errEl.classList.add('hidden'); okEl.classList.add('hidden');
  if (!email) { errEl.textContent='Ingresá tu email'; errEl.classList.remove('hidden'); return; }
  setLoading('btn-forgot', true, 'Enviando...');
  try {
    await fbSendPasswordReset(email);
    okEl.textContent = 'Listo. Revisá tu correo (y la carpeta de spam) para restablecer tu contraseña.';
    okEl.classList.remove('hidden');
  } catch(e) {
    errEl.textContent = e.code==='auth/invalid-email' ? 'Email inválido' :
                         e.code==='auth/user-not-found' ? 'No existe una cuenta con ese email' :
                         'Error al enviar el correo. Probá de nuevo.';
    errEl.classList.remove('hidden');
  }
  setLoading('btn-forgot', false, 'Enviar enlace');
}
window.doForgotPassword = doForgotPassword;
function togglePass() { const i = document.getElementById('login-pass'); i.type = i.type === 'password' ? 'text' : 'password'; }
window.togglePass = togglePass;

function firebaseErrorMsg(code) {
  const map = {
    'auth/user-not-found': 'No existe una cuenta con ese email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos.',
    'auth/network-request-failed': 'Sin conexión a internet'
  };
  return map[code] || 'Error: ' + (code || 'desconocido');
}

function setLoading(btnId, loading, text) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = text;
  btn.style.opacity = loading ? '0.7' : '1';
}

// ======== START APP ========
async function startApp() {
  document.getElementById('app').classList.remove('hidden');
  updateUserUI();
  updateHeroDate();

  if (!navigator.onLine) {
    setSyncStatus('offline');
    loadLocalData();
    showToast('Modo sin conexión — datos locales', '');
  } else {
    setSyncStatus('syncing');
    try {
      await loadMyData();
      setSyncStatus('ok');
      setTimeout(processSyncQueue, 2000);
    } catch(e) {
      console.warn('Firebase load failed, using local:', e.message);
      setSyncStatus('error');
      loadLocalData();
    }
  }

  updateStats();
  renderTodayList();
  showPage('home', false);
  updateVersionBadge();
  startLocationTracking();
  // Cargar tickets Jira asignados al técnico (con delay para no bloquear el render inicial)
  setTimeout(() => loadJiraTickets(), 2000);

  // Supervisor: watch all reports live
  if (currentUser.role === 'supervisor') {
    unsubReports = fbWatchAllReports(reports => {
      localReports = reports;
      updateStats();
      if (currentPage === 'supervisor') renderSupervisor();
    });
    unsubVersionesObjetivo = fbWatchVersionesObjetivo(v => {
      versionesObjetivo = v;
      updateVersionBadge();
      if (currentPage === 'supervisor') renderSupervisor();
    });
  }
}

// Load data from localStorage only (offline mode)
function loadLocalData() {
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}

  try {
    const stored = localStorage.getItem('scancheck_local_scans_' + currentUser.id);
    localScans = stored ? JSON.parse(stored).map(s => ({ ...s, photos: s.photos?.length ? s.photos : (photoCache[s.id]||photoCache[s.fbId]||[]) })) : [];
  } catch(e) { localScans = []; }

  try {
    const stored = localStorage.getItem('scancheck_local_reports_' + currentUser.id);
    localReports = stored ? JSON.parse(stored).map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(s => ({ ...s, photos: s.photos?.length ? s.photos : (photoCache[s.id]||photoCache[s.fbId]||[]) }))
    })) : [];
  } catch(e) { localReports = []; }
  limpiarFotosLocalesViejas();
}

// Las fotos en base64 de cada scan quedaban en localStorage PARA SIEMPRE: no
// había ni un removeItem en toda la app. Con hasta 10 fotos por registro
// (~250 KB cada una), el espacio se agota en pocos días de trabajo y a partir
// de ahí falla en silencio cualquier guardado nuevo — un gasto de viáticos, por
// ejemplo. Una vez que las fotos están subidas a R2 (photoUrls) y el registro
// tiene unos días, la copia local es redundante: la app ya muestra photoUrls
// primero, tanto en la lista como en el detalle.
// Se conservan las de los últimos días para poder verlas sin conexión.
function limpiarFotosLocalesViejas(diasMin = 7) {
  const limite = diasMin * 24 * 60 * 60 * 1000;
  const ahora = Date.now();
  const porId = {};
  localScans.forEach(s => { if (s.id) porId[s.id] = s; if (s.fbId) porId[s.fbId] = s; });

  const aBorrar = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('scancheck_photos_')) continue;
      const scan = porId[key.replace('scancheck_photos_', '')];
      if (!scan) continue;                              // registro desconocido: no tocar
      if (!(scan.photoUrls || []).length) continue;     // todavía no está en R2: no tocar
      const ts = scan.timestamp ? new Date(scan.timestamp).getTime() : ahora;
      if (ahora - ts < limite) continue;                // reciente: dejarlo para uso offline
      aBorrar.push(key);
    }
  } catch(e) { return; }

  let bytes = 0;
  aBorrar.forEach(key => {
    try {
      bytes += (localStorage.getItem(key) || '').length;
      localStorage.removeItem(key);
    } catch(e) {}
  });
  if (aBorrar.length) {
    console.log(`Limpieza: ${aBorrar.length} registros liberaron ~${(bytes/1048576).toFixed(1)} MB de fotos locales (siguen disponibles en R2).`);
  }
}

async function loadMyData() {
  // Build photo cache from localStorage
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}

  const restorePhotos = (s) => {
    // URLs de R2 siempre se preservan en photoUrls para acceso cross-device
    const photoUrls = s.photoUrls && s.photoUrls.length > 0 ? s.photoUrls : null;
    if (s.photos && s.photos.length > 0) return photoUrls ? { ...s, photoUrls } : s;
    // Fotos en localStorage (legacy / offline)
    const localPhotos = photoCache[s.id] || photoCache[s.fbId] || [];
    if (localPhotos.length > 0) return { ...s, photos: localPhotos, ...(photoUrls ? { photoUrls } : {}) };
    // Solo URLs de R2
    if (photoUrls) return { ...s, photoUrls };
    return s;
  };

  const [fbScans, fbReports] = await Promise.all([
    fbGetMyScans(currentUser.id),
    fbGetMyReports(currentUser.id)
  ]);

  // Load local-only items (not yet synced — no fbId)
  let localOnlyScans = [], localOnlyReports = [];
  try {
    const ls = localStorage.getItem('scancheck_local_scans_' + currentUser.id);
    if (ls) {
      const parsed = JSON.parse(ls);
      const fbIds = new Set(fbScans.map(s => s.id||s.fbId));
      localOnlyScans = parsed.filter(s => !fbIds.has(s.id) && !fbIds.has(s.fbId));
    }
  } catch(e) {}
  try {
    const lr = localStorage.getItem('scancheck_local_reports_' + currentUser.id);
    if (lr) {
      const parsed = JSON.parse(lr);
      const fbIds = new Set(fbReports.map(r => r.id||r.fbId));
      localOnlyReports = parsed.filter(r => !r.fbId && !fbIds.has(r.id));
    }
  } catch(e) {}

  localScans = [...fbScans.map(restorePhotos), ...localOnlyScans.map(restorePhotos)];
  localReports = [
    ...fbReports.map(rep => ({ ...rep, scansSnapshot: (rep.scansSnapshot||[]).map(restorePhotos) })),
    ...localOnlyReports.map(rep => ({ ...rep, scansSnapshot: (rep.scansSnapshot||[]).map(restorePhotos) }))
  ];

  localScans.sort((a,b) => new Date(b.timestamp||0) - new Date(a.timestamp||0));
  localReports.sort((a,b) => new Date(b.createdAt||b.date||0) - new Date(a.createdAt||a.date||0));
  // También acá: loadLocalData() solo corre sin conexión, así que la limpieza
  // tiene que estar en los dos caminos o nunca se ejecutaría en uso normal.
  limpiarFotosLocalesViejas();
}

function updateUserUI() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('menu-user-name').textContent = currentUser.name;
  document.getElementById('menu-user-email').textContent = currentUser.email;
  document.getElementById('menu-user-role').textContent = currentUser.role === 'supervisor' ? 'Supervisor' : 'Técnico';
  if (currentUser.role === 'supervisor') document.getElementById('btn-supervisor-menu').classList.remove('hidden');
  if (currentUser.role === 'supervisor') document.getElementById('btn-flota-menu').classList.remove('hidden');
  // Inject Danaide logo into header
  const logoWrap = document.getElementById('header-logo');
  if (logoWrap && DANAIDE_LOGO) {
    logoWrap.innerHTML = `<img src="${DANAIDE_LOGO}" style="height:28px;object-fit:contain;opacity:.9">`;
  }
  // Show email verification reminder if applicable
  const banner = document.getElementById('verify-email-banner');
  if (banner) {
    if (currentUser.emailVerified === false) banner.classList.remove('hidden');
    else banner.classList.add('hidden');
  }
}

async function resendVerification() {
  try {
    await fbResendVerification();
    showToast('✓ Email de verificación reenviado — revisá spam','success');
  } catch(e) {
    console.error('Verification error:', e.code, e.message);
    let msg = 'Error al reenviar';
    if (e.code === 'auth/too-many-requests') msg = 'Demasiados intentos. Esperá unos minutos.';
    else if (e.code) msg = 'Error: ' + e.code;
    showToast(msg, 'error');
  }
}
window.resendVerification = resendVerification;

function setSyncStatus(state) {
  const dot = document.querySelector('.sync-dot');
  if (!dot) return;
  const colors = { ok:'#00d4aa', syncing:'#ffa040', error:'#ff5555', offline:'#888888' };
  dot.style.background = colors[state] || '#ff5555';
  dot.title = state === 'ok' ? 'Sincronizado' : state === 'syncing' ? 'Sincronizando...' : state === 'offline' ? 'Sin conexión' : 'Error de sincronización';
}

// ======== PASOS FRONTERIZOS — BASE DE DATOS GPS ========
// Coordenadas de cada paso/aeropuerto para autocompletar el campo "Nombre del paso"
// cuando el técnico está dentro de un radio de 1000m del punto.
const PASOS_COORDS = [
  // ── INTERNOS DNM (oficinas, aeropuertos — no son pasos del IGN) ──
  { nombre: 'AERO CHAPELCO',                           lat: -40.0750, lon: -71.1361, prov: 'NEUQUEN', pais: '-' },
  { nombre: 'AERO NEUQUEN',                            lat: -38.9489, lon: -68.1556, prov: 'NEUQUEN', pais: '-' },
  { nombre: 'AERO MAR DEL PLATA',                      lat: -37.9342, lon: -57.5733, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'GUARDIA DE PUERTO',                       lat: -34.6100, lon: -58.3700, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'PUERTO TIGRE',                            lat: -34.4333, lon: -58.5833, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'TERMINAL DE CRUCEROS',                    lat: -34.6150, lon: -58.3650, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'BUQUEBUS',                                lat: -34.59760, lon: -58.36763, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'COLONIA EXPRESS',                         lat: -34.62502, lon: -58.36125, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'Terminal Cruceros Pto.Madryn',             lat: -42.762279, lon: -65.025183, prov: 'CHUBUT', pais: '-' },
  { nombre: 'ANTARTIDA ARGENTINA - CAPACITACIONES',    lat: -34.6000, lon: -58.4500, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'ANTARTIDA ARGENTINA - CONTROL MIGRATORIO',lat: -34.6000, lon: -58.4500, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'ANTARTIDA ARGENTINA - INFORMATICA',       lat: -34.6000, lon: -58.4500, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'RENAPER - CONTROL DE CALIDAD - INFORMATICA', lat: -34.6050, lon: -58.4550, prov: 'BUENOS AIRES', pais: '-' },
  { nombre: 'AERO CORDOBA',                            lat: -31.3236, lon: -64.2083, prov: 'CORDOBA', pais: '-' },
  { nombre: 'AERO MERLO - CONLARA',                    lat: -32.3800, lon: -65.1797, prov: 'SAN LUIS', pais: '-' },
  { nombre: 'AERO ROSARIO',                            lat: -32.9036, lon: -60.7850, prov: 'SANTA FE', pais: '-' },
  { nombre: 'AERO SAUCE VIEJO',                        lat: -31.7117, lon: -60.8117, prov: 'SANTA FE', pais: '-' },
  { nombre: 'AERO FORMOSA',                            lat: -26.2127, lon: -58.2281, prov: 'FORMOSA', pais: '-' },
  { nombre: 'AERO RESISTENCIA',                        lat: -27.4500, lon: -59.0561, prov: 'CHACO', pais: '-' },
  { nombre: 'AERO IGUAZU',                             lat: -25.7373, lon: -54.4734, prov: 'MISIONES', pais: '-' },
  { nombre: 'AERO JUJUY',                              lat: -24.3833, lon: -65.0833, prov: 'JUJUY', pais: '-' },
  { nombre: 'AERO TERMAS DE RIO HONDO',                lat: -27.4950, lon: -64.9350, prov: 'SANTIAGO DEL ESTERO', pais: '-' },
  { nombre: 'AERO RIO GALLEGOS',                       lat: -51.6089, lon: -69.3127, prov: 'SANTA CRUZ', pais: '-' },
  { nombre: 'AERO USHUAIA',                            lat: -54.8433, lon: -68.2958, prov: 'TIERRA DEL FUEGO', pais: '-' },

  // ── PASOS DE FRONTERA OFICIALES — Fuente: IGN (Instituto Geográfico Nacional)
  // Capa: pasos_de_fronteras_internacionales — 158 pasos según Resolución 482/2020 MSG
  // Actualizar: https://wms.ign.gob.ar/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=ign:pasos_de_fronteras_internacionales&outputFormat=application/json
  { nombre: 'SALVADOR MAZZA - YACUIBA', lat: -22.05302, lon: -63.68383, prov: 'SALTA', pais: 'BOLIVIA' },
  { nombre: 'PUERTO CHALANAS - BERMEJO', lat: -22.73192708, lon: -64.35146154, prov: 'SALTA', pais: 'BOLIVIA' },
  { nombre: 'AGUAS BLANCAS - BERMEJO', lat: -22.72626, lon: -64.36939, prov: 'SALTA', pais: 'BOLIVIA' },
  { nombre: 'EL CONDADO - LA MAMORA', lat: -22.19008366, lon: -64.65271139, prov: 'SALTA', pais: 'BOLIVIA' },
  { nombre: 'LA QUIACA - VILLAZON', lat: -22.09651351, lon: -65.59617958, prov: 'JUJUY', pais: 'BOLIVIA' },
  { nombre: 'PASO DE LOS LIBRES - URUGUAYANA', lat: -29.7429, lon: -57.09323, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'PUERTO YAPEYU - PUERTO SAN MARCOS', lat: -29.4973386, lon: -56.83688672, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'PUERTO LA CRUZ - ITAQUI', lat: -29.15613421, lon: -56.60306194, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'PUERTO ALVEAR - PUERTO ITAQUI', lat: -29.11590519, lon: -56.55456402, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'SANTO TOME - SAO BORJA', lat: -28.61077, lon: -56.0144, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'PUERTO GARRUCHOS - GARRUCHOS', lat: -28.1800015, lon: -55.64204696, prov: 'CORRIENTES', pais: 'BRASIL' },
  { nombre: 'PUERTO SAN ISIDRO - SAN ISIDRO', lat: -28.05462585, lon: -55.41269536, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PUERTO SANTA MARIA - COLONIA FLORIDA', lat: -27.96713654, lon: -55.33999714, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PASO DE LA BARCA - PORTO XAVIER', lat: -27.89576494, lon: -55.13688334, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PANAMBI - VERACRUZ', lat: -27.73188719, lon: -54.90821205, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'BARRA BONITA - MBIGUA', lat: -27.60422311, lon: -54.83972993, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PUERTO ALBA POSSE - PORTO MAUA', lat: -27.57253166, lon: -54.67547481, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'AURORA - PRATOS', lat: -27.49822514, lon: -54.51709924, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'ALICIA - SAN ANTONIO', lat: -27.46719715, lon: -54.34646759, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'EL SOBERBIO - PORTO SOBERBO', lat: -27.30027287, lon: -54.19181095, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PEPIRI GUAZU - SAO MIGUEL', lat: -26.61316, lon: -53.73439, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'BERNARDO DE IRIGOYEN - DIONISIO CERQUEIRA', lat: -26.25472, lon: -53.64357, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'INTEGRACION - PLANALTO', lat: -25.76909179, lon: -53.85128968, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'SAN ANTONIO - SANTO ANTONIO', lat: -26.05686, lon: -53.7307, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'ANDRESITO - CAPANEMA', lat: -25.60210773, lon: -53.97002106, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'IGUAZU - FOZ DO IGUACU', lat: -25.58877, lon: -54.56149, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'PUERTO IGUAZU - PUERTO MEIRA', lat: -25.59219112, lon: -54.57958065, prov: 'MISIONES', pais: 'BRASIL' },
  { nombre: 'JAMA', lat: -23.22657, lon: -67.06284, prov: 'JUJUY', pais: 'CHILE' },
  { nombre: 'SICO', lat: -23.84443, lon: -67.26124, prov: 'SALTA', pais: 'CHILE' },
  { nombre: 'SOCOMPA', lat: -24.45167, lon: -68.28972, prov: 'SALTA', pais: 'CHILE' },
  { nombre: 'SAN FRANCISCO', lat: -26.8734713, lon: -68.29855904, prov: 'CATAMARCA', pais: 'CHILE' },
  { nombre: 'PIRCAS NEGRAS', lat: -28.06976, lon: -69.29927, prov: 'LA RIOJA', pais: 'CHILE' },
  { nombre: 'AGUA NEGRA', lat: -30.19288, lon: -69.82611, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'MIRANDA', lat: -30.66469, lon: -70.24225, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'EL PORTILLO DEL VENTILLO', lat: -30.70715, lon: -70.25629, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'GUANA', lat: -30.7384, lon: -70.26303, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'DEL PORTILLO', lat: -30.76655, lon: -70.27258, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'VALLE HERMOSO', lat: -30.78314, lon: -70.28319, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'LOS AZULES', lat: -30.94991, lon: -70.31548, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'CALDERON', lat: -31.26818, lon: -70.52698, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'EL AZUFRE', lat: -31.30476, lon: -70.5437, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'CASA DE PIEDRA', lat: -31.5509, lon: -70.55914, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'PUENTECILLAS', lat: -31.67206, lon: -70.51093, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'MONDACA', lat: -31.85435, lon: -70.42671, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'LAS OJOTAS', lat: -31.91856, lon: -70.24027, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'QUEBRADA FRIA', lat: -32.0832, lon: -70.33997, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'LAS LLARETAS', lat: -32.15019, lon: -70.31459, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'SISTEMA CRISTO REDENTOR', lat: -32.81463874, lon: -70.08270061, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'PORTILLO DE PIUQUENES', lat: -33.63171, lon: -69.87568, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'CAJON DEL MAIPO', lat: -34.22253, lon: -69.80109, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'VERGARA', lat: -35.20573, lon: -70.52035, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'PEHUENCHE', lat: -35.98193, lon: -70.39425, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'PICHACHEN', lat: -37.45368, lon: -71.12408, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'COPAHUE', lat: -37.82586, lon: -71.12845, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'PINO HACHADO', lat: -38.66336, lon: -70.89684, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'ICALMA', lat: -38.83368, lon: -71.26799, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'MAMUIL MALAL', lat: -39.58254, lon: -71.46177, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'CARIRRIÑE', lat: -39.7889, lon: -71.68129, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'HUA HUM', lat: -40.10042, lon: -71.67238, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'CARDENAL ANTONIO SAMORE', lat: -40.7126, lon: -71.9444, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'PEREZ ROSALES', lat: -41.06929245, lon: -71.82763333, prov: 'RIO NEGRO', pais: 'CHILE' },
  { nombre: 'VURILOCHE', lat: -41.22471219, lon: -71.85819792, prov: 'RIO NEGRO', pais: 'CHILE' },
  { nombre: 'RIO MANSO', lat: -41.50832403, lon: -71.84666659, prov: 'RIO NEGRO', pais: 'CHILE' },
  { nombre: 'RIO PUELO', lat: -42.10390471, lon: -71.72774597, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'FUTALEUFU', lat: -43.17559, lon: -71.75516, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'RIO ENCUENTRO', lat: -43.588, lon: -71.70713, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'LAS PAMPAS', lat: -44.24904, lon: -71.80902, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'RIO FRIAS', lat: -44.55076, lon: -71.09968, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'PAMPA ALTA', lat: -45.23279, lon: -71.34687, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'COYHAIQUE', lat: -45.5224, lon: -71.55568, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'TRIANA', lat: -45.58242, lon: -71.73438, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'HUEMULES', lat: -45.91465, lon: -71.6451, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'INGENIERO PALLAVICINI - IBAÑEZ', lat: -46.27573, lon: -71.72741, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'JEINEMENI', lat: -46.58446, lon: -71.6614, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'ROBALLOS', lat: -47.1579, lon: -71.85607, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'RIO MAYER - RIBERA NORTE', lat: -48.20728073, lon: -72.31312413, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'RIO MOSCO', lat: -48.48371, lon: -72.56014, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'LAGO SAN MARTIN - O\'HIGGINS', lat: -48.8678282, lon: -72.66675602, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'RIO DON GUILLERMO', lat: -51.24599, lon: -72.25899, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'DOROTEA', lat: -51.58612, lon: -72.34812, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'LAURITA - CASAS VIEJAS', lat: -51.68467, lon: -72.29877, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'INTEGRACION AUSTRAL', lat: -52.14144, lon: -69.51979, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'SAN SEBASTIAN', lat: -53.31999, lon: -68.6065, prov: 'TIERRA DEL FUEGO', pais: 'CHILE' },
  { nombre: 'RIO BELLA VISTA (EX RADMAN)', lat: -54.00012, lon: -68.6076, prov: 'TIERRA DEL FUEGO', pais: 'CHILE' },
  { nombre: 'PUERTO ALMANZA - PUERTO WILLIAMS', lat: -54.89442285, lon: -67.57991516, prov: 'TIERRA DEL FUEGO', pais: 'CHILE' },
  { nombre: 'JAMA NORTE', lat: -23.22730104, lon: -67.06306905, prov: 'JUJUY', pais: 'CHILE' },
  { nombre: 'JAMA SUR', lat: -23.23302639, lon: -67.06481523, prov: 'JUJUY', pais: 'CHILE' },
  { nombre: 'LAGUNA SICO', lat: -23.87487642, lon: -67.27139769, prov: 'SALTA', pais: 'CHILE' },
  { nombre: 'DE BUTA MALLIN', lat: -37.21137959, lon: -71.11994541, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'REIGOLIL', lat: -39.12043114, lon: -71.41558248, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'HUA HUM FLUVIAL', lat: -40.10323, lon: -71.6735, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'RIO PUELO FLUVIAL', lat: -42.1053, lon: -71.72847, prov: 'CHUBUT', pais: 'CHILE' },
  { nombre: 'PORTEZUELO DE LA DIVISORIA', lat: -48.96116761, lon: -72.81650166, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'MARCONI', lat: -49.16678593, lon: -73.11601803, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'CONDOR - DANIEL POSESION', lat: -52.16263, lon: -69.15071, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'CERRO REDONDO - DANIEL FRONTERA', lat: -52.22342, lon: -68.94627, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'MONTE DINERO', lat: -52.33245, lon: -68.41937, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'ALFA CULLEN', lat: -52.77846193, lon: -68.60672373, prov: 'TIERRA DEL FUEGO', pais: 'CHILE' },
  { nombre: 'PASCUA LAMA', lat: -29.3201, lon: -70.01467, prov: 'SAN JUAN', pais: 'CHILE' },
  { nombre: 'CAÑADON ALFA', lat: -52.70003, lon: -68.60675, prov: 'TIERRA DEL FUEGO', pais: 'CHILE' },
  { nombre: 'CONDOR II', lat: -52.28348, lon: -68.73934, prov: 'SANTA CRUZ', pais: 'CHILE' },
  { nombre: 'PUERTO ITA IBATE - PANCHITO LOPEZ', lat: -27.41241552, lon: -57.32031396, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO YAHAPE - PUERTO CERRITO', lat: -27.36617034, lon: -57.65327313, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO ITATI - PUERTO ITA CORA', lat: -27.26249494, lon: -58.24183747, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO PASO DE LA PATRIA - PASO DE LA PATRIA', lat: -27.30920027, lon: -58.57351431, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'YACIRETA - YACIRETA', lat: -27.48231, lon: -56.72125, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO SAN ANTONIO DE APIPE - PUERTO AYOLAS', lat: -27.50428478, lon: -56.74062406, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO ITUZAINGO - PUERTO AYOLAS', lat: -27.58170266, lon: -56.69731891, prov: 'CORRIENTES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO IGUAZU - PUERTO TRES FRONTERAS', lat: -25.59317423, lon: -54.58907024, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO LIBERTAD - PUERTO DOMINGO MARTINEZ DE IRALA', lat: -25.91390612, lon: -54.62207745, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO WANDA - PUERTO ITA VERA', lat: -25.96490185, lon: -54.60695362, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO MADO - PUERTO LOMAS VALENTINAS', lat: -26.22820609, lon: -54.63156703, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO VICTORIA - CAPITAN URBINA', lat: -26.33312433, lon: -54.6658753, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO PINARES - CARLOS ANTONIO LOPEZ', lat: -26.43750559, lon: -54.70083153, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO ELDORADO - PUERTO MAYOR JULIO OTAÑO', lat: -26.40459545, lon: -54.69696444, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO PIRAY - PUERTO 7 DE AGOSTO', lat: -26.47173584, lon: -54.73076642, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO MONTECARLO - PUERTO APE AIME', lat: -26.56029899, lon: -54.80772818, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO PARANAY - COLONIA ALBORADA', lat: -26.67164174, lon: -54.81752226, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO GARUHAPE - PUERTO 3 DE MAYO', lat: -26.78845869, lon: -54.96735249, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO RICO - PUERTO TRIUNFO', lat: -26.78949509, lon: -55.02519377, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO LEONI - PUERTO TRIUNFO', lat: -26.92479206, lon: -55.13766616, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO OASIS - CAPITAN MEZA', lat: -26.93966948, lon: -55.24542094, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO MANI - PUERTO BELLA VISTA SUR', lat: -27.10279614, lon: -55.51903347, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO SAN IGNACIO - PUERTO PARAISO', lat: -27.26755313, lon: -55.57283413, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO SANTA ANA - PUERTO SAMUHU', lat: -27.33683703, lon: -55.59317708, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO CANDELARIA - CAMPICHUELO', lat: -27.44564297, lon: -55.74702185, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'POSADAS - ENCARNACION', lat: -27.37019, lon: -55.86397, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO POSADAS - PUERTO PACU CUA', lat: -27.36969848, lon: -55.86427138, prov: 'MISIONES', pais: 'PARAGUAY' },
  { nombre: 'PUERTO COLONIA CANO - PUERTO PILAR', lat: -26.86318976, lon: -58.32151481, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PUERTO FORMOSA - PUERTO ALBERDI', lat: -26.18159788, lon: -58.15910432, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PUERTO PILCOMAYO - PUERTO ITA ENRAMADA', lat: -25.36983485, lon: -57.64815295, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'CLORINDA - PUERTO JOSE A. FALCON', lat: -25.26428082, lon: -57.72441284, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PASARELA LA FRATERNIDAD', lat: -25.2860306, lon: -57.7089698, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'COLONIA GENERAL BELGRANO- GENERAL BRUGUEZ', lat: -24.74828, lon: -58.83307, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'ISLETA - PARAJE ROJAS SILVA', lat: -24.01269, lon: -60.03716, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PASO EL REMANSO - LA VERDE', lat: -23.95349, lon: -60.48912, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PASO LAMADRID - MISION SAN LEONARDO', lat: -23.88657, lon: -60.71573, prov: 'FORMOSA', pais: 'PARAGUAY' },
  { nombre: 'PUERTO LAS PALMAS - PUERTO HUMAITA', lat: -27.08224612, lon: -58.55625945, prov: 'CHACO', pais: 'PARAGUAY' },
  { nombre: 'PUERTO BERMEJO - PUERTO PILAR', lat: -26.88760471, lon: -58.38015963, prov: 'CHACO', pais: 'PARAGUAY' },
  { nombre: 'MISION LA PAZ - POZO HONDO', lat: -22.37823403, lon: -62.51860616, prov: 'SALTA', pais: 'PARAGUAY' },
  { nombre: 'PUERTO GUAZU GUAZUCITO - CARMELO', lat: -34.011888, lon: -58.36684615, prov: 'BUENOS AIRES', pais: 'URUGUAY' },
  { nombre: 'PUERTO MARTIN GARCIA - CARMELO', lat: -34.19003, lon: -58.25714, prov: 'BUENOS AIRES', pais: 'URUGUAY' },
  { nombre: 'PUERTO PARANACITO - NUEVA PALMIRA', lat: -33.86591276, lon: -58.42916307, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO BOCA DEL GUALEGUAYCHU - FRAY BENTOS', lat: -33.10895612, lon: -58.32489501, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'GUALEGUAYCHU - FRAY BENTOS', lat: -33.10033, lon: -58.24844, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO CONCEPCION DEL URUGUAY - PAYSANDU', lat: -32.4507952, lon: -58.20207996, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'COLON - PAYSANDU', lat: -32.26474, lon: -58.0995, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO COLON - PUERTO PAYSANDU', lat: -32.31205677, lon: -58.10467415, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO CONCORDIA - SALTO', lat: -31.3886171, lon: -57.97945775, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO LUIS - CONSTITUCION', lat: -31.17250025, lon: -57.91331095, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'CONCORDIA - SALTO', lat: -31.27494921, lon: -57.93812348, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO FEDERACION - VILLA CONSTITUCION', lat: -31.05617251, lon: -57.86535381, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'PUERTO MONTE CASEROS - BELLA UNION', lat: -30.2570158, lon: -57.61562664, prov: 'CORRIENTES', pais: 'URUGUAY' },
  { nombre: 'PUERTO SANTA ELOISA - BELEN', lat: -30.77460904, lon: -57.80183783, prov: 'ENTRE RIOS', pais: 'URUGUAY' },
  { nombre: 'MINAS ÑUBLE', lat: -36.88336, lon: -71.13286, prov: 'NEUQUEN', pais: 'CHILE' },
  { nombre: 'LAS DAMAS', lat: -34.88469004, lon: -70.29110898, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'LAS LEÑAS', lat: -34.45177145, lon: -70.06439841, prov: 'MENDOZA', pais: 'CHILE' },
  { nombre: 'ESCOMBRERA CERRO AMARILLO', lat: -31.69329312, lon: -70.49535672, prov: 'SAN JUAN', pais: 'CHILE' },
];

// Calcula distancia en metros entre dos puntos GPS (fórmula de Haversine)
function gpsDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Intenta autocompletar el campo "Nombre del paso" (scanner, tótem o tablet)
// si el técnico está dentro de 200m de algún paso conocido.
// Solo autocompleta si el campo está vacío (no sobreescribe lo que el técnico ya ingresó).
function autoFillPasoFromGPS(lat, lon) {
  const RADIO_METROS = 200;
  let masNear = null, minDist = Infinity;
  for (const p of PASOS_COORDS) {
    const d = gpsDistanceMeters(lat, lon, p.lat, p.lon);
    if (d < minDist) { minDist = d; masNear = p; }
  }
  if (!masNear || minDist > RADIO_METROS) return;

  let algunoCompletado = false;
  ['inp-paso', 'totem-paso', 'tablet-paso'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo && !campo.value.trim()) {
      campo.value = masNear.nombre;
      algunoCompletado = true;
    }
  });
  if (algunoCompletado) showToast(`📍 Paso detectado: ${masNear.nombre}`, 'success');
}

// ======== LOCATION TRACKING ========
window.autoFillPasoFromGPS = autoFillPasoFromGPS;

// ── Verificar estado del paso (abierto/cerrado) ──────────────
// Consulta el endpoint /listado de argentina.gob.ar con estado en tiempo real.
// Respuesta: { encontrado, nombreOficial, estado, abierto, estadoVialidad,
//              cortadoVialidad, horario, provincia, pais, actualizacion,
//              urlDetalle, fuente }
async function verificarEstadoPaso(nombrePaso) {
  if (!nombrePaso || !navigator.onLine) return null;
  try {
    const nombre = nombrePaso.split(' - ')[0].split(' (')[0].trim();
    const res = await fetch(`${PASOS_PROXY_URL}?nombre=${encodeURIComponent(nombre)}`).catch(() => null);
    if (!res || !res.ok) return null;
    const data = await res.json();
    return data; // { hayAlerta, alertaMasReciente, alertas[], fuente }
  } catch(e) {
    console.warn('Error verificando estado del paso:', e.message);
    return null;
  }
}
window.verificarEstadoPaso = verificarEstadoPaso;

// Busca un paso por nombre en PASOS_COORDS (para mostrar provincia/país en viajes)
function buscarPasoPorNombre(nombre) {
  if (!nombre) return null;
  const n = nombre.trim().toUpperCase();
  return PASOS_COORDS.find(p => p.nombre.toUpperCase() === n) ||
         PASOS_COORDS.find(p => p.nombre.toUpperCase().includes(n) || n.includes(p.nombre.toUpperCase()));
}
window.buscarPasoPorNombre = buscarPasoPorNombre;

// Se dispara al salir del campo "Destino" en Iniciar Viaje — consulta el estado
// en tiempo real del paso desde argentina.gob.ar/seguridad/pasosinternacionales/listado
async function checkEstadoPasoDestino() {
  const input = document.getElementById('inp-viaje-destino');
  const display = document.getElementById('estado-paso-destino');
  if (!input || !display) return;
  const destino = input.value.trim();
  if (!destino) { display.style.display = 'none'; return; }

  display.style.display = 'block';
  display.style.background = 'var(--bg3)';
  display.style.color = 'var(--text3)';
  display.style.padding = '8px 12px';
  display.style.cursor = 'default';
  display.onclick = null;
  display.textContent = '⏳ Consultando estado del paso...';

  const data = await verificarEstadoPaso(destino);
  const urlListado = 'https://www.argentina.gob.ar/seguridad/pasosinternacionales';

  // Paso no encontrado en el listado oficial
  if (!data || !data.encontrado) {
    display.style.background = 'var(--bg3)';
    display.style.padding = '0';
    display.innerHTML = `<a href="${urlListado}" target="_blank"
      style="display:block;padding:8px 12px;color:var(--accent);text-decoration:none;font-size:12px">
      🔗 Ver estado de pasos en argentina.gob.ar</a>`;
    return;
  }

  const urlDetalle = data.urlDetalle || urlListado;

  // Caso 0: sin datos confiables — gris con link al sitio oficial
  if (data.sinDatos) {
    display.style.background = 'var(--bg3)';
    display.style.color = 'var(--text3)';
    display.style.padding = '8px 12px';
    display.style.cursor = 'pointer';
    display.onclick = () => mostrarModalEstadoPaso(data, urlDetalle);
    display.innerHTML = `
      <div style="font-weight:600">❓ ${escHtml(data.nombreOficial)} — Estado no disponible</div>
      <div style="font-size:11px;margin-top:2px;opacity:.7">Verificar en el sitio oficial — tocá para ver</div>`;
    return;
  }

  // Caso 1: CERRADO o corte de vialidad — alerta roja
  if (!data.abierto || data.cortadoVialidad) {
    display.style.background = 'rgba(239,68,68,.12)';
    display.style.color = '#ef4444';
    display.style.padding = '8px 12px';
    display.style.cursor = 'pointer';
    display.innerHTML = `
      <div style="font-weight:700">🚫 ${escHtml(data.nombreOficial)} — ${escHtml(data.estado)}</div>
      ${data.cortadoVialidad ? `<div style="font-size:11px;margin-top:2px">⚠️ Vialidad: ${escHtml(data.estadoVialidad)}</div>` : ''}
      ${data.horario ? `<div style="font-size:11px;margin-top:2px">🕐 ${escHtml(data.horario)}</div>` : ''}
      <div style="font-size:11px;margin-top:2px;opacity:.7">Tocá para ver más</div>`;
    display.onclick = () => mostrarModalEstadoPaso(data, urlDetalle);
    mostrarModalEstadoPaso(data, urlDetalle);
    return;
  }

  // Caso 2: ABIERTO pero con corte de vialidad — alerta amarilla
  if (data.abierto && data.cortadoVialidad) {
    display.style.background = 'rgba(255,184,0,.12)';
    display.style.color = '#ffb800';
    display.style.padding = '8px 12px';
    display.style.cursor = 'pointer';
    display.innerHTML = `
      <div style="font-weight:600">⚠️ ${escHtml(data.nombreOficial)} — Abierto con restricciones</div>
      <div style="font-size:11px;margin-top:2px">🚧 Vialidad: ${escHtml(data.estadoVialidad)}</div>
      ${data.horario ? `<div style="font-size:11px;margin-top:2px">🕐 ${escHtml(data.horario)}</div>` : ''}`;
    display.onclick = () => mostrarModalEstadoPaso(data, urlDetalle);
    return;
  }

  // Caso 3: ABIERTO y sin problemas — verde
  display.style.background = 'rgba(34,197,94,.08)';
  display.style.color = 'var(--text2)';
  display.style.padding = '8px 12px';
  display.style.cursor = 'pointer';
  display.onclick = () => mostrarModalEstadoPaso(data, urlDetalle);
  display.innerHTML = `
    <div style="font-weight:600;color:#22c55e">✅ ${escHtml(data.nombreOficial)} — Abierto</div>
    ${data.horario ? `<div style="font-size:11px;margin-top:2px">🕐 ${escHtml(data.horario)}</div>` : ''}
    ${data.telefono ? `<div style="font-size:11px;margin-top:2px">📞 ${escHtml(data.telefono)}</div>` : ''}
    <div style="font-size:11px;margin-top:2px;opacity:.6">Tocá para ver más</div>`;
}

// Modal con el detalle completo del paso — estado, horario, vialidad y link al sitio oficial.
function mostrarModalEstadoPaso(data, url) {
  if (document.getElementById('modal-estado-paso')) return;
  const modal = document.createElement('div');
  modal.id = 'modal-estado-paso';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';

  const abierto = data.abierto;
  const estadoColor = data.sinDatos ? 'var(--text3)' : (abierto ? '#22c55e' : '#ef4444');
  const estadoIcon = data.sinDatos ? '❓' : (abierto ? '✅' : '🚫');
  const estadoTexto = data.sinDatos ? 'Sin datos — verificar en sitio oficial' : data.estado;
  const filas = [];

  if (data.estado)
    filas.push(`<div style="margin-bottom:8px"><span style="opacity:.6;font-size:11px">ESTADO</span><br>
      <strong style="color:${estadoColor}">${estadoIcon} ${escHtml(estadoTexto)}</strong></div>`);
  if (data.motivo)
    filas.push(`<div style="margin-bottom:8px;padding:8px;background:rgba(239,68,68,.08);border-radius:8px;border-left:3px solid #ef4444">
      <span style="opacity:.6;font-size:11px">MOTIVO</span><br>
      ${escHtml(data.motivo)}</div>`);
  if (data.estadoVialidad && data.cortadoVialidad)
    filas.push(`<div style="margin-bottom:8px;padding:8px;background:rgba(255,184,0,.1);border-radius:8px;border-left:3px solid #ffb800">
      <span style="opacity:.6;font-size:11px">VIALIDAD NACIONAL</span><br>
      <strong>⚠️ ${escHtml(data.estadoVialidad)}</strong></div>`);
  if (data.horario)
    filas.push(`<div style="margin-bottom:8px"><span style="opacity:.6;font-size:11px">HORARIO</span><br>
      <strong>🕐 ${escHtml(data.horario)}</strong></div>`);
  if (data.telefono)
    filas.push(`<div style="margin-bottom:8px"><span style="opacity:.6;font-size:11px">CONTACTO</span><br>
      <a href="tel:${escHtml(data.telefono)}" style="color:var(--accent);font-weight:600;text-decoration:none">📞 ${escHtml(data.telefono)}</a></div>`);
  if (data.provincia || data.pais)
    filas.push(`<div style="margin-bottom:8px"><span style="opacity:.6;font-size:11px">UBICACIÓN</span><br>
      <strong>${escHtml([data.provincia, data.pais].filter(Boolean).join(' → '))}</strong></div>`);
  if (data.actualizacion)
    filas.push(`<div style="margin-bottom:4px"><span style="opacity:.6;font-size:10px">Actualizado: ${escHtml(data.actualizacion)}</span></div>`);

  modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:360px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;text-align:center">
      🛂 ${escHtml(data.nombreOficial || data.nombreBuscado || 'Paso fronterizo')}
    </div>
    <div style="font-size:13px;color:var(--text2);max-height:280px;overflow-y:auto">
      ${filas.length ? filas.join('') : '<p style="opacity:.6;text-align:center">Sin información disponible</p>'}
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button id="modal-estado-paso-cerrar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Cerrar</button>
      <a href="${url}" target="_blank" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center">Ver más</a>
    </div>
  </div>`;
  document.body.appendChild(modal);
  document.getElementById('modal-estado-paso-cerrar').onclick = () => modal.remove();
}
window.mostrarModalEstadoPaso = mostrarModalEstadoPaso;
window.checkEstadoPasoDestino = checkEstadoPasoDestino;
function requestLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) };
    reverseGeocode(currentLocation.lat, currentLocation.lon);
    autoFillPasoFromGPS(currentLocation.lat, currentLocation.lon);
  }, () => {}, { enableHighAccuracy: true, timeout: 10000 });
}

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`);
    const d = await r.json();
    if (currentLocation) currentLocation.address = d.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    if (currentUser) pushLocationToFirebase();
  } catch(e) {
    if (currentLocation) currentLocation.address = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}

async function pushLocationToFirebase() {
  if (!currentUser || !currentLocation) return;
  try {
    await fbUpdateLocation(currentUser.id, currentUser.name, currentLocation.lat, currentLocation.lon, currentLocation.address || '');
  } catch(e) {}
}

function startLocationTracking() {
  // Update location every 3 minutes
  locationUpdateTimer = setInterval(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) };
      reverseGeocode(currentLocation.lat, currentLocation.lon);
    }, () => {}, { enableHighAccuracy: false });
  }, 180000);
}

function getWatermarkLines() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' });
  const hora  = now.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const coords = currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lon.toFixed(6)}` : 'GPS no disponible';
  const lines = [`${fecha}  ${hora}`, coords];
  if (currentLocation?.address) {
    // Dirección completa en la marca de agua — el canvas se ajusta al ancho disponible
    const addr = currentLocation.address;
    lines.push(addr);
  }
  return lines;
}

// ======== NAVIGATION ========
const pageTitles = {
  'home':'Inicio','new-scan':'Nuevo Registro','report':'Informe del Día',
  'view-report':'Ver Informe','history':'Historial',
  'supervisor':'Panel Supervisor','viajes':'Mis Viajes','flota':'Gestión de Flota'
, 'new-totem': 'Registro de Tótem', 'new-tablet': 'Registro de Tablet', 'new-punto': 'Registro de Punto de Captura'};

function showPage(name, addHistory=true) {
  // Si la cámara está abierta (overlay global) y se navega a otra página, cerrarla
  if (cameraStream) stopCamera();
  const current = document.getElementById('page-'+currentPage);
  const next    = document.getElementById('page-'+name);
  if (!next) return;
  if (current) current.classList.remove('active');
  next.classList.add('active');
  if (addHistory && name !== currentPage) pageHistory.push(currentPage);
  currentPage = name;
  document.getElementById('page-title').textContent = pageTitles[name] || name;
  document.getElementById('btn-back').classList.toggle('hidden', pageHistory.length === 0);
  if (name === 'home')        { updateStats(); renderTodayList(); }
  if (name === 'mis-tickets') { loadJiraTickets(); }
  if (name === 'history')    renderHistory();
  if (name === 'new-scan')   resetNewScanForm();
  if (name === 'viajes')     { loadViajes(); window.scrollTo(0,0); }
  if (name === 'supervisor') renderSupervisor();
}
window.showPage = showPage;

function goBack() {
  if (!pageHistory.length) return;
  stopCamera(); stopQRScan();
  showPage(pageHistory.pop(), false);
}
window.goBack = goBack;

function toggleMenu() {
  const vEl = document.getElementById('app-version-label');
  if (vEl) vEl.textContent = typeof APP_VERSION !== 'undefined' ? 'ScanCheck ' + APP_VERSION : ''; document.getElementById('dropdown-menu').classList.toggle('hidden'); }
window.toggleMenu = toggleMenu;
document.addEventListener('click', e => {
  const m = document.getElementById('dropdown-menu');
  if (!m.classList.contains('hidden') && !e.target.closest('#dropdown-menu') && !e.target.closest('#header-user')) m.classList.add('hidden');
});

// ======== DATE / STATS ========
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function updateHeroDate() {
  const label = new Date().toLocaleDateString('es-AR', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('hero-date').textContent = label.charAt(0).toUpperCase()+label.slice(1);
}
function getOrphanScans() {
  // Registros que no tienen informe cerrado — incluye días anteriores
  const reportedIds = new Set(localReports.filter(r=>!r.eliminado).flatMap(r=>r.scanIds||[]));
  const seen = new Set();
  return localScans.filter(s => {
    if (s.eliminado) return false;
    if (reportedIds.has(s.id) || reportedIds.has(s.fbId)) return false;
    // Deduplicar por fbId (puede haber duplicados si el scan está en localScans dos veces)
    const key = s.fbId || s.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function updateStats() {
  const today = getTodayKey();
  const todayScans = localScans.filter(s => localDateKey(s.timestamp) === today);
  document.getElementById('stat-today').textContent   = todayScans.length;
  document.getElementById('stat-total').textContent   = localScans.length;
  document.getElementById('stat-reports').textContent = localReports.filter(r => !r.eliminado).length;
  document.getElementById('btn-close-day-wrap').classList.toggle('hidden', todayScans.length === 0);
  // Badge naranja en "Total Registros" si hay registros sin informe de días anteriores
  const orphans = getOrphanScans().filter(s => localDateKey(s.timestamp) !== today);
  const badge = document.getElementById('orphan-badge');
  if (badge) {
    badge.classList.toggle('hidden', orphans.length === 0);
    badge.textContent = orphans.length > 0 ? orphans.length : '';
  }
}

// ======== TODAY LIST ========
function localDateKey(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function renderTodayList() {
  const today = getTodayKey();
  const scans = localScans.filter(s => localDateKey(s.timestamp) === today).slice().reverse();
  const container = document.getElementById('today-list');
  if (!scans.length) {
    container.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><p>Sin registros hoy</p></div>`;
    return;
  }
  container.innerHTML = scans.map(s => {
    const time  = new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    // Miniatura: priorizar photoUrls (R2, válidas siempre) y caer a photos
    // (base64 local, solo disponible en el dispositivo que las tomó) — mismo
    // orden que usa viewScan() para el detalle del registro.
    const thumbSrc = (s.photoUrls && s.photoUrls[0]) || (s.photos && s.photos[0]) || null;
    const thumb = thumbSrc ? `<img src="${thumbSrc}" alt="foto">` : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    return `<div class="scan-item" onclick="viewScan('${s.id||s.fbId}')">
      <div class="scan-item-thumb">${thumb}</div>
      <div class="scan-item-info">
        <div class="scan-item-paso">${s.producto==='totem'?'🗼 ':(s.producto==='tablet'?'📱 ':'')}${escHtml(s.paso||'(Sin nombre)')}</div>
        <div class="scan-item-meta">Puesto: ${escHtml(s.puesto||'—')} · Serie: ${escHtml(s.serie||'—')}${s.producto==='totem'?' · Tótem':(s.producto==='tablet'?' · Tablet':'')}</div>
        <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span>
      </div>
      <div class="scan-item-time">${time}</div>
      <div class="scan-item-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9,18 15,12 9,6"/></svg></div>
    </div>`;
  }).join('');
}

function opLabel(op) {
  if (op === 'instalacion_nueva') return 'Instalación - Puesto nuevo';
  if (op === 'instalacion_reemplazo') return 'Instalación - Reemplazo';
  if (op === 'instalacion') return 'Instalación';
  if (op === 'cambio_equipo') return 'Cambio de equipo';
  if (op === 'reemplazo') return 'Cambio de equipo'; // compatibilidad registros viejos
  if (op === 'falla_reparable') return 'Falla reparable en sitio';
  if (op === 'incidencia') return 'Incidencia';
  return 'Mantenimiento Preventivo';
}

let currentIncidenciaSubtipo = 'cambio_equipo'; // 'cambio_equipo' o 'falla_reparable'
let currentInstalacionSubtipo = 'instalacion_nueva'; // 'instalacion_nueva' o 'instalacion_reemplazo'

// ======== OP TYPE ========
function setOpType(type, btn) {
  currentOpType = type;
  document.querySelectorAll('.op-btn[data-op]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const esIncidencia = type === 'incidencia';
  const esInstalacion = type === 'instalacion';

  document.getElementById('incidencia-fields').classList.toggle('hidden', !esIncidencia);
  document.getElementById('instalacion-fields').classList.toggle('hidden', !esInstalacion);
  document.getElementById('checklist-mantenimiento-fields').classList.toggle('hidden', esIncidencia || esInstalacion);
  document.getElementById('checklist-instalacion-fields').classList.toggle('hidden', !esInstalacion);
  document.getElementById('serie-normal-group').style.display =
    (esIncidencia && currentIncidenciaSubtipo === 'cambio_equipo') ? 'none' : '';

  if (esIncidencia) setIncidenciaSubtipo(currentIncidenciaSubtipo);
  if (esInstalacion) setInstalacionSubtipo(currentInstalacionSubtipo);
}
window.setOpType = setOpType;

function setInstalacionSubtipo(subtipo) {
  currentInstalacionSubtipo = subtipo;
  const esReemplazo = subtipo === 'instalacion_reemplazo';
  document.getElementById('instalacion-reemplazo-fields').classList.toggle('hidden', !esReemplazo);
  document.getElementById('inst-btn-nueva').classList.toggle('active', !esReemplazo);
  document.getElementById('inst-btn-reemplazo').classList.toggle('active', esReemplazo);
}
window.setInstalacionSubtipo = setInstalacionSubtipo;

function setIncidenciaSubtipo(subtipo) {
  currentIncidenciaSubtipo = subtipo;
  const esCambio = subtipo === 'cambio_equipo';
  document.getElementById('incidencia-reemplazo-fields').classList.toggle('hidden', !esCambio);
  document.getElementById('incidencia-falla-fields').classList.toggle('hidden', esCambio);
  document.getElementById('serie-normal-group').style.display = esCambio ? 'none' : '';
  document.getElementById('inc-btn-cambio').classList.toggle('active', esCambio);
  document.getElementById('inc-btn-falla').classList.toggle('active', !esCambio);
}
window.setIncidenciaSubtipo = setIncidenciaSubtipo;

// ======== RESET FORM ========
function resetNewScanForm() {
  ['inp-paso','inp-puesto','inp-serie','inp-notas','inp-serie-retira','inp-serie-nuevo','inp-pc-nombre','inp-scanner-serie','inp-scanner-modelo','inp-scanner-estado','inp-inv-dnd','inp-inv-dnm','inp-nuevo-marca-modelo','falla-otro-texto','rep-otro-texto','inp-inst-serie-retira'].forEach(id => { const el=document.getElementById(id); if(el)el.value=''; });
  { const el=document.getElementById('inp-scanner-estado'); if(el) el.classList.add('select-placeholder'); }
  const marcaVieja = document.getElementById('inp-marca-vieja'); if(marcaVieja) marcaVieja.value = '';
  ['chk-vidrio','chk-cable-usb','chk-fuente','chk-limpieza','chk-update-assureid','chk-update-librerias','chk-autoinicio-doc-auth','chk-autoinicio-sentinel','chk-camara-web',
   'chki-fuente-conectada','chki-usb3','chki-drivers-desko','chki-librerias-desko','chki-aplicativos-desko','chki-assureid-librerias','chki-autoinicio-doc-auth','chki-autoinicio-sentinel','chki-settings-sensitivity','chki-prueba-revealid','chki-prueba-sicam',
   'falla-alimentacion','falla-cristal','falla-usb','falla-mrz','falla-chip','falla-sensor','falla-irrojo','falla-mecanica','falla-intermitente','falla-dano-fisico','falla-obsolescencia','falla-otro-check',
   'rep-fuente','rep-cristal','rep-usb','rep-software','rep-esponja','rep-otro-check'
  ].forEach(id => { const el=document.getElementById(id); if(el)el.checked=false; });
  capturedPhotos = []; currentOpType = 'mantenimiento';
  // NO limpiamos editingScanId aquí — lo gestiona editScan/saveScan directamente
  // Restaurar botón guardar por si se cancela una edición
  const btnG = document.getElementById('btn-save-scan');
  if (btnG) { btnG.textContent = '✓ Guardar Registro'; btnG.style.background = ''; }
  // Si se navega a new-scan SIN pasar por editScan, limpiar el modo edición
  if (!window._keepEditId) editingScanId = null;
  window._keepEditId = false;
  currentIncidenciaSubtipo = 'cambio_equipo'; currentInstalacionSubtipo = 'instalacion_nueva';
  qrAssureEngine = null; qrAssureDocLib = null; qrAssureLicKey = null; qrDatosSistema = {};
  document.querySelectorAll('.op-btn[data-op]').forEach(b=>b.classList.remove('active'));
  document.querySelector('.op-btn[data-op="mantenimiento"]').classList.add('active');
  document.getElementById('incidencia-fields').classList.add('hidden');
  document.getElementById('instalacion-fields').classList.add('hidden');
  document.getElementById('incidencia-reemplazo-fields').classList.remove('hidden');
  document.getElementById('incidencia-falla-fields').classList.add('hidden');
  document.getElementById('instalacion-reemplazo-fields').classList.add('hidden');
  document.getElementById('checklist-mantenimiento-fields').classList.remove('hidden');
  document.getElementById('checklist-instalacion-fields').classList.add('hidden');
  document.getElementById('serie-normal-group').style.display = '';
  document.getElementById('qr-data-preview').classList.add('hidden');
  const instBtnNueva = document.getElementById('inst-btn-nueva'); if(instBtnNueva) instBtnNueva.classList.add('active');
  const instBtnRemp = document.getElementById('inst-btn-reemplazo'); if(instBtnRemp) instBtnRemp.classList.remove('active');
  const incBtnCambio = document.getElementById('inc-btn-cambio'); if(incBtnCambio) incBtnCambio.classList.add('active');
  const incBtnFalla = document.getElementById('inc-btn-falla'); if(incBtnFalla) incBtnFalla.classList.remove('active');
  renderPhotosGrid(); stopCamera(); stopQRScan();
}

// ======== PHOTOS ========
function renderPhotosGrid() {
  // Actualiza las grillas del scanner, tótem y tablet (solo una es visible a la vez)
  const badgeT = document.getElementById('totem-photo-count-badge');
  if (badgeT) badgeT.textContent = `${capturedPhotos.length}/10`;
  const gridT = document.getElementById('totem-photos-grid');
  if (gridT) gridT.innerHTML = capturedPhotos.map((p,i)=>`
    <div class="photo-thumb"><img src="${p.dataUrl}"><button class="photo-del" onclick="removePhoto(${i})">✕</button></div>`).join('');
  const btnT = document.getElementById('totem-btn-add-photo');
  if (btnT) { btnT.disabled = capturedPhotos.length >= 10; btnT.style.opacity = capturedPhotos.length >= 10 ? '0.4' : '1'; }

  const badgeTb = document.getElementById('tablet-photo-count-badge');
  if (badgeTb) badgeTb.textContent = `${capturedPhotos.length}/10`;
  const gridTb = document.getElementById('tablet-photos-grid');
  if (gridTb) gridTb.innerHTML = capturedPhotos.map((p,i)=>`
    <div class="photo-thumb"><img src="${p.dataUrl}"><button class="photo-del" onclick="removePhoto(${i})">✕</button></div>`).join('');
  const btnTb = document.getElementById('tablet-btn-add-photo');
  if (btnTb) { btnTb.disabled = capturedPhotos.length >= 10; btnTb.style.opacity = capturedPhotos.length >= 10 ? '0.4' : '1'; }
  document.getElementById('photo-count-badge').textContent = `${capturedPhotos.length}/10`;
  document.getElementById('photos-grid').innerHTML = capturedPhotos.map((p,i)=>`
    <div class="photo-thumb"><img src="${p.dataUrl}" alt="foto ${i+1}">
    <button class="del-photo" onclick="removePhoto(${i})">×</button></div>`).join('');
  const btn = document.getElementById('btn-add-photo');
  btn.disabled = capturedPhotos.length >= 10;
  btn.style.opacity = capturedPhotos.length >= 10 ? '0.4' : '1';
}
window.removePhoto = i => { capturedPhotos.splice(i,1); renderPhotosGrid(); };

function handleFileUpload(e) {
  const files = Array.from(e.target.files).slice(0, 10-capturedPhotos.length);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1280; let w=img.width, h=img.height;
        if (w>maxW) { h=Math.round(h*maxW/w); w=maxW; }
        canvas.width=w; canvas.height=h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        drawWatermarkOnCanvas(ctx,w,h);
        capturedPhotos.push({ dataUrl:canvas.toDataURL('image/jpeg',0.82), info:getWatermarkLines().join(' | ') });
        renderPhotosGrid();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  e.target.value='';
}
window.handleFileUpload = handleFileUpload;

// ======== CAMERA ========
async function startCamera() {
  if (capturedPhotos.length>=10) { showToast('Máximo 10 fotos','error'); return; }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:960}}});
    const vid = document.getElementById('camera-stream');
    vid.srcObject = cameraStream;
    document.getElementById('camera-container').style.display = 'block';
    try { await vid.play(); } catch(e) {}
    updateLiveOverlay();
    overlayTimer = setInterval(updateLiveOverlay, 1000);
    requestLocation();
  } catch(e) { showToast('No se pudo acceder a la cámara','error'); }
}
window.startCamera = startCamera;

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; }
  clearInterval(overlayTimer); overlayTimer=null;
  const vid = document.getElementById('camera-stream');
  if (vid) vid.srcObject=null;
  const container = document.getElementById('camera-container');
  if (container) container.style.display = 'none';
}
window.stopCamera = stopCamera;

function updateLiveOverlay() {
  const el = document.getElementById('cam-live-overlay');
  if (el) el.textContent = getWatermarkLines().join('\n');
}

function capturePhoto() {
  const vid = document.getElementById('camera-stream');
  const canvas = document.createElement('canvas');
  canvas.width=vid.videoWidth||1280; canvas.height=vid.videoHeight||960;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(vid,0,0,canvas.width,canvas.height);
  drawWatermarkOnCanvas(ctx,canvas.width,canvas.height);
  capturedPhotos.push({ dataUrl:canvas.toDataURL('image/jpeg',0.82), info:getWatermarkLines().join(' | ') });
  renderPhotosGrid();
  if (capturedPhotos.length>=10) stopCamera();
  showToast(`Foto ${capturedPhotos.length}/10 capturada`,'success');
}
window.capturePhoto = capturePhoto;

function drawWatermarkOnCanvas(ctx,w,h) {
  const lines=getWatermarkLines(), pad=12, lineH=18;
  const fontSize=Math.max(11,Math.min(15,w*0.011));
  const maxW = w - pad*2;
  ctx.font=`${fontSize}px monospace`;
  // Si una línea es más ancha que el canvas, reducir font size hasta que entre
  const fittedLines = lines.map(l => {
    let fs = fontSize;
    ctx.font=`${fs}px monospace`;
    while(ctx.measureText(l).width > maxW && fs > 8) {
      fs -= 0.5;
      ctx.font=`${fs}px monospace`;
    }
    return { text: l, fontSize: fs };
  });
  const boxH=lines.length*lineH+pad*2;
  ctx.fillStyle='rgba(0,0,0,0.62)';
  ctx.fillRect(0,h-boxH,w,boxH);
  ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.textAlign='left';
  fittedLines.forEach(({text,fontSize:fs},i)=>{
    ctx.font=`${fs}px monospace`;
    ctx.fillText(text,pad,h-boxH+pad+(i+1)*lineH-3);
  });
  ctx.fillStyle='#00d4aa'; ctx.fillRect(0,h-boxH,4,boxH);
}

// ======== QR SCAN ========
let qrScanInterval = null;

function startQRScan() {
  // Listen for result from the QR scanner window
  window.addEventListener('message', onQRMessage);

  // Also check sessionStorage in case we came back from the scanner page
  const stored = sessionStorage.getItem('scancheck_qr_result');
  if (stored) {
    sessionStorage.removeItem('scancheck_qr_result');
    processQRData(stored);
    return;
  }

  // Open the standalone QR scanner page
  const scannerUrl = new URL('qr-scanner.html', window.location.href).href;
  const popup = window.open(scannerUrl, 'qr_scanner', 'width=400,height=700');

  // If popup was blocked, navigate in same tab
  if (!popup || popup.closed) {
    sessionStorage.setItem('scancheck_return_page', currentPage);
    window.location.href = scannerUrl;
  }
}
window.startQRScan = startQRScan;
window.processQRData = processQRData;

function onQRMessage(event) {
  if (event.data && event.data.type === 'QR_DATA') {
    window.removeEventListener('message', onQRMessage);
    processQRData(event.data.data);
  } else if (event.data && event.data.type === 'QR_CANCEL') {
    window.removeEventListener('message', onQRMessage);
  }
}

function stopQRScan() {
  qrScanning = false;
}

window.stopQRScan = stopQRScan;

function scanQRFrame(vid) {
  if (!qrScanning) return;
  if (vid.readyState === vid.HAVE_ENOUGH_DATA) {
    const c = document.createElement('canvas');
    c.width  = vid.videoWidth  || 640;
    c.height = vid.videoHeight || 480;
    const ctx = c.getContext('2d');
    ctx.drawImage(vid, 0, 0, c.width, c.height);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    // jsQR loaded as regular script — accessible via window.jsQR
    const jsQRFn = window.jsQR || (typeof jsQR !== 'undefined' ? jsQR : null);
    if (jsQRFn) {
      const code = jsQRFn(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
      if (code && code.data) {
        processQRData(code.data);
        stopQRScan();
        return;
      }
    }
  }
  requestAnimationFrame(() => scanQRFrame(vid));
}

function processQRData(raw) {
  try {
    // ¿Es una etiqueta de tótem/tablet generada por ScanCheck?
    try {
      const et = JSON.parse(raw);
      if (et && et.t === 'totem') {
        window._esperandoEtiquetaTotem = false;
        fillTotemFromEtiqueta(et);
        return;
      }
      if (et && et.t === 'tablet') {
        window._esperandoEtiquetaTablet = false;
        fillTabletFromEtiqueta(et);
        return;
      }
    } catch(e) {}

    let data;
    try { data=JSON.parse(raw); } catch(e) {
      data={};
      raw.split('\n').forEach(line=>{ const [k,...v]=line.split('='); if(k&&v.length) data[k.trim()]=v.join('=').trim(); });
    }

    // Mapeo completo de claves cortas y largas del inventario.ps1
    const g = (a,b,c) => data[a]||data[b]||data[c]||''; // get with fallbacks
    const puestoVal = g('PC','NombrePC','ComputerName');
    const serieVal  = g('SN','Serial','SerialNumber');
    const dskSerie  = g('DSKS','DESKO_Scanner_Serial','');
    const dskModelo = g('DSKM','DESKO_Scanner_Modelo','');
    const dskEstado = g('DKOS','DESKO_Scanner_Status','') || g('DSKO','DESKO_Scanner_Status','');
    const assureEngine = g('AEV','AssureID_Engine_Version','');
    const assureDocLib = g('ADL','AssureID_DocLib_Version','');
    const assureLicKey = g('ALK','AssureID_LicenseKey','');
    const assureDocLibFecha = g('ADLF','AssureID_DocLib_Fecha','');
    const assureDocLibRuta  = g('ADLR','AssureID_DocLib_Ruta','');
    const assureServicio    = g('ASVC','AssureID_Servicio_Estado','');

    // ── Campos nuevos v2 ──
    const qrUptime      = g('UPT','Uptime','');
    const qrUltimoRein  = g('LBT','UltimoReinicio','');
    const qrReinPend    = g('RPD','ReinicioPendiente','');
    const qrUpdPend     = g('UPD','UpdatesPendientes','');
    const qrDiscoModelo = g('DSM','Disco_Modelo','');
    const qrDiscoSerial = g('DSS','Disco_Serial','');
    const qrDiscoTipo   = g('DST','Disco_Tipo','');
    const qrDiscoSMART  = g('DSH','Disco_Estado_SMART','');
    const qrDiscoTotalGB= g('DSTG','Disco_Total_GB','');
    const qrDiscoLibreGB= g('DSLG','Disco_Libre_GB','');
    const qrDiscoUsoPct = g('DSUP','Disco_Uso_Porcentaje','');
    const qrDiscoTempC  = g('DSTC','Disco_Temperatura_C','');
    const qrUsbTotal    = g('USBT','USB_Dispositivos_Total','');
    const qrUsbErrores  = g('USBE','USB_Dispositivos_Error','');

    // Guardar en estado de módulo para saveScan
    if (qrUptime)      qrDatosSistema.uptime      = qrUptime;
    if (qrUltimoRein)  qrDatosSistema.ultimoRein  = qrUltimoRein;
    if (qrReinPend)    qrDatosSistema.reinPend     = qrReinPend;
    if (qrUpdPend)     qrDatosSistema.updPend      = qrUpdPend;
    if (qrDiscoModelo) qrDatosSistema.discoModelo  = qrDiscoModelo;
    if (qrDiscoSerial) qrDatosSistema.discoSerial  = qrDiscoSerial;
    if (qrDiscoTipo)   qrDatosSistema.discoTipo    = qrDiscoTipo;
    if (qrDiscoSMART)  qrDatosSistema.discoSMART   = qrDiscoSMART;
    if (qrDiscoTotalGB)qrDatosSistema.discoTotalGB = qrDiscoTotalGB;
    if (qrDiscoLibreGB)qrDatosSistema.discoLibreGB = qrDiscoLibreGB;
    if (qrDiscoUsoPct) qrDatosSistema.discoUsoPct  = qrDiscoUsoPct;
    if (qrDiscoTempC)  qrDatosSistema.discoTempC   = qrDiscoTempC;
    if (qrUsbTotal)    qrDatosSistema.usbTotal      = qrUsbTotal;
    if (qrUsbErrores)  qrDatosSistema.usbErrores    = qrUsbErrores;
    if (assureDocLibFecha) qrDatosSistema.docLibFecha = assureDocLibFecha;
    if (assureDocLibRuta)  qrDatosSistema.docLibRuta  = assureDocLibRuta;
    if (assureServicio)    qrDatosSistema.servicioEstado = assureServicio;

    // El QR siempre sobreescribe los campos de hardware — son datos de la PC actual,
    // no del técnico, así que siempre deben reflejar lo que leyó el script.
    if (puestoVal) { const el=document.getElementById('inp-pc-nombre'); if(el) el.value=puestoVal; }
    if (serieVal)  { const el=document.getElementById('inp-serie');  if(el) el.value=serieVal; }
    if (dskSerie && dskSerie!=='N/A')  { const el=document.getElementById('inp-scanner-serie');  if(el) el.value=dskSerie; }
    if (dskModelo && dskModelo!=='No detectado') { const el=document.getElementById('inp-scanner-modelo'); if(el) el.value=dskModelo; }
    if (dskEstado && dskEstado!=='N/A') { const el=document.getElementById('inp-scanner-estado'); if(el) { el.value=dskEstado; el.classList.toggle('select-placeholder', !el.value); } }
    if (assureEngine) qrAssureEngine = assureEngine;
    if (assureDocLib) qrAssureDocLib = assureDocLib;
    if (assureLicKey) qrAssureLicKey = assureLicKey;

    // Construir notas completas con TODA la info del inventario
    const notasEl = document.getElementById('inp-notas');
    if (notasEl && !notasEl.value) {
      const fab  = g('FAB','Fabricante','');
      const mod  = g('MOD','Modelo','');
      const ip   = g('IP','','');
      const mac  = g('MAC','','');
      const cpu  = g('CPU','','');
      const cpup = g('CPUP','UsoCPU_Porcentaje','');
      const ramt = g('RAMT','MemoriaTotal_GB','');
      const ramu = g('RAMU','MemoriaUsada_GB','');
      const ramp = g('RAMP','UsoMemoria_Porcentaje','');
      const usr  = g('USR','Usuario','');
      const aev  = g('AEV','AssureID_Engine_Version','AssureID_Engine');
      const adl  = g('ADL','AssureID_DocLib_Version','AssureID_DocLib');
      const aed  = g('AED','AssureID_Edicion','');
      const alk  = g('ALK','AssureID_LicenseKey','');
      const ati  = g('ATI','AssureID_Tipo','');
      const aac  = g('AAC','AssureID_Activacion','');
      const avn  = g('AVN','AssureID_Vencimiento','');
      const aai  = g('AAI','AssureID_ActivationID','');
      const ts   = g('TS','Fecha','');
      const lines = [];
      if (fab||mod)  lines.push('Equipo: '+[fab,mod].filter(Boolean).join(' '));
      if (usr)       lines.push('Usuario PC: '+usr);
      if (ip)        lines.push('IP: '+ip+'  MAC: '+mac);
      if (cpu)       lines.push('CPU: '+cpu+' ('+cpup+'%)');
      if (ramt)      lines.push('RAM: '+ramu+'/'+ramt+' GB ('+ramp+'% uso)');
      // Campos nuevos en notas
      if (qrUptime)       lines.push('Uptime: '+qrUptime+' | Ultimo reinicio: '+qrUltimoRein);
      if (qrReinPend && qrReinPend!=='No') lines.push('⚠ Reinicio pendiente: '+qrReinPend);
      if (qrUpdPend && qrUpdPend!=='0' && qrUpdPend!=='N/D') lines.push('⚠ Actualizaciones de Windows pendientes: '+qrUpdPend);
      if (qrDiscoModelo)  lines.push('Disco: '+qrDiscoModelo+' ('+qrDiscoTipo+') — SMART: '+qrDiscoSMART);
      if (qrDiscoTotalGB) lines.push('Espacio disco: '+qrDiscoLibreGB+' GB libres / '+qrDiscoTotalGB+' GB total ('+qrDiscoUsoPct+'% uso)');
      if (qrDiscoTempC && qrDiscoTempC!=='N/D') lines.push('Temp disco: '+qrDiscoTempC+'°C');
      if (qrUsbTotal)     lines.push('USB: '+qrUsbTotal+' disp. detectados, '+qrUsbErrores+' con error');
      if (aev && aev!=='No instalado') {
        lines.push('--- AssureID ---');
        lines.push('Engine: v'+aev);
        if (adl && adl!=='No instalado') lines.push('DocLib: v'+adl);
        if (assureDocLibFecha && assureDocLibFecha!=='N/A') lines.push('DocLib actualizado: '+assureDocLibFecha);
        if (assureDocLibRuta) lines.push('DocLib ruta: '+assureDocLibRuta);
        if (assureServicio) {
          const servicioOk = assureServicio.toLowerCase().includes('corriendo') || assureServicio.toLowerCase()==='running';
          lines.push((servicioOk?'':'⚠ ')+'Servicio AssureID: '+assureServicio);
        }
        if (aed && aed!=='N/A')          lines.push('Edicion: '+aed);
        if (ati && ati!=='N/A')          lines.push('Tipo lic: '+ati);
        if (alk && alk!=='N/A')          lines.push('LicKey: '+alk);
        if (aac && aac!=='N/A')          lines.push('Activacion: '+aac);
        if (avn && avn!=='N/A')          lines.push('Vencimiento: '+avn);
        if (aai && aai!=='N/A')          lines.push('ActivationID: '+aai);
      }
      if (ts) lines.push('Relevado: '+ts);
      notasEl.value = lines.join('\n');
    }

    // Preview completo
    const preview = Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n');
    const el = document.getElementById('qr-data-preview');
    el.textContent = preview; el.classList.remove('hidden');
    showToast(`✓ QR leído — ${Object.keys(data).length} campos`,'success');
  } catch(e) { showToast('No se pudo leer el QR','error'); }
}

// ======== SAVE SCAN ========
// ── Fotos → Cloudflare R2 ────────────────────────────────────
// Sube las fotos de un scan al bucket R2 y devuelve array de URLs públicas.
// Si no hay conexión o falla alguna foto, guarda las que pudo y sigue.
async function uploadPhotosToR2(scanId, photos) {
  if (!photos || photos.length === 0) return [];
  const urls = [];
  for (let i = 0; i < photos.length; i++) {
    try {
      const dataUrl = typeof photos[i] === 'string' ? photos[i] : photos[i].dataUrl;
      if (!dataUrl) continue;
      // Convertir base64 a blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `foto_${i+1}_${Date.now()}.jpg`;
      const uploadRes = await fetch(`${PHOTOS_PROXY_URL}/upload/${scanId}/${filename}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-ScanCheck-Token': PHOTOS_TOKEN
        },
        body: blob
      });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        urls.push(data.url);
      }
    } catch(e) {
      console.warn(`Error subiendo foto ${i+1}:`, e.message);
    }
  }
  return urls;
}

// Carga las URLs de fotos de un scan desde R2 (para mostrar en modal/PDF).
async function loadPhotosFromR2(scanId) {
  try {
    const res = await fetch(`${PHOTOS_PROXY_URL}/list/${scanId}`, {
      headers: { 'X-ScanCheck-Token': PHOTOS_TOKEN }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos || []).map(p => p.url);
  } catch(e) {
    return [];
  }
}

async function saveScan() {
  const paso  = document.getElementById('inp-paso').value.trim();
  const puesto= document.getElementById('inp-puesto').value.trim();
  const notas = document.getElementById('inp-notas').value.trim();
  if (!paso)   { showToast('Ingresá el nombre del paso','error'); return; }
  if (!puesto) { showToast('Ingresá el número de puesto','error'); return; }

  let serie='', serieRetira='', serieNuevo='';
  // Determinar opType real según el modo principal y sub-tipo seleccionado
  let opTypeReal = currentOpType;
  if (currentOpType === 'incidencia') {
    opTypeReal = currentIncidenciaSubtipo; // 'cambio_equipo' o 'falla_reparable'
  } else if (currentOpType === 'instalacion') {
    opTypeReal = currentInstalacionSubtipo; // 'instalacion_nueva' o 'instalacion_reemplazo'
  }

  if (opTypeReal === 'cambio_equipo') {
    serieRetira=document.getElementById('inp-serie-retira').value.trim();
    serieNuevo =document.getElementById('inp-serie-nuevo').value.trim();
    if (!serieRetira||!serieNuevo) { showToast('Ingresá ambos números de serie','error'); return; }
    serie=serieNuevo;
  } else {
    serie=document.getElementById('inp-serie').value.trim();
    if (!serie) { showToast('Ingresá el número de serie','error'); return; }
  }

  const qrEl=document.getElementById('qr-data-preview');
  const pcData=!qrEl.classList.contains('hidden') ? qrEl.textContent : null;

  const pcNombre      = document.getElementById('inp-pc-nombre').value.trim();
  const scannerSerie  = document.getElementById('inp-scanner-serie').value.trim();
  const scannerModelo = document.getElementById('inp-scanner-modelo').value.trim();
  const scannerEstado = document.getElementById('inp-scanner-estado').value.trim();
  const invDnd        = document.getElementById('inp-inv-dnd').value.trim();
  const invDnm        = document.getElementById('inp-inv-dnm').value.trim();

  const checklist = {
    vidrio:   document.getElementById('chk-vidrio').checked,
    cableUsb: document.getElementById('chk-cable-usb').checked,
    fuente:   document.getElementById('chk-fuente').checked,
    limpieza: document.getElementById('chk-limpieza').checked,
    updateAssureId:  document.getElementById('chk-update-assureid').checked,
    updateLibrerias: document.getElementById('chk-update-librerias').checked,
    autoInicioDocAuth:  document.getElementById('chk-autoinicio-doc-auth').checked,
    autoInicioSentinel: document.getElementById('chk-autoinicio-sentinel').checked,
    camaraWeb:          document.getElementById('chk-camara-web')?.checked || false,
    camaraWebMarca:     document.getElementById('chk-camara-web')?.checked ? (document.getElementById('chk-camara-web-marca')?.value.trim() || '') : ''
  };

  // Checklist de instalación (equipo nuevo) — solo relevante cuando opTypeReal es instalacion_*
  const checklistInstalacion = {
    fuenteConectada:    document.getElementById('chki-fuente-conectada').checked,
    usb3:               document.getElementById('chki-usb3').checked,
    driversDesko:       document.getElementById('chki-drivers-desko').checked,
    libreriasDesko:     document.getElementById('chki-librerias-desko').checked,
    aplicativosDesko:   document.getElementById('chki-aplicativos-desko').checked,
    assureIdLibrerias:  document.getElementById('chki-assureid-librerias').checked,
    autoInicioDocAuth:  document.getElementById('chki-autoinicio-doc-auth').checked,
    autoInicioSentinel: document.getElementById('chki-autoinicio-sentinel').checked,
    settingsSensitivity:document.getElementById('chki-settings-sensitivity').checked,
    pruebaRevealId:     document.getElementById('chki-prueba-revealid').checked,
    pruebaSicam:        document.getElementById('chki-prueba-sicam').checked,
    loggingFilter:      document.getElementById('chki-logging-filter')?.checked || false
  };

  // Datos del Acta de Reemplazo — solo cuando es cambio_equipo (Incidencia)
  let actaReemplazo = null;
  if (opTypeReal === 'cambio_equipo') {
    const fallaChecklist = {
      alimentacion:   document.getElementById('falla-alimentacion').checked,
      cristal:        document.getElementById('falla-cristal').checked,
      usb:            document.getElementById('falla-usb').checked,
      mrz:            document.getElementById('falla-mrz').checked,
      chip:           document.getElementById('falla-chip').checked,
      sensor:         document.getElementById('falla-sensor').checked,
      irrojo:         document.getElementById('falla-irrojo').checked,
      mecanica:       document.getElementById('falla-mecanica').checked,
      intermitente:   document.getElementById('falla-intermitente').checked,
      danoFisico:     document.getElementById('falla-dano-fisico').checked,
      obsolescencia:  document.getElementById('falla-obsolescencia').checked,
      otro:           document.getElementById('falla-otro-check').checked,
      otroTexto:      document.getElementById('falla-otro-texto').value.trim()
    };
    actaReemplazo = {
      fallaChecklist,
      nuevoMarcaModelo: document.getElementById('inp-nuevo-marca-modelo').value.trim()
    };
  }

  // Datos de instalación reemplazo de contrato anterior (equipo viejo Thales/3M)
  let instalacionReemplazoData = null;
  if (opTypeReal === 'instalacion_reemplazo') {
    instalacionReemplazoData = {
      marcaVieja: document.getElementById('inp-marca-vieja')?.value || 'Thales',
      serieVieja: document.getElementById('inp-inst-serie-retira')?.value.trim() || ''
    };
  }

  // Checklist de falla reparable en sitio — solo cuando es falla_reparable
  let fallaReparable = null;
  if (opTypeReal === 'falla_reparable') {
    fallaReparable = {
      fuente:    document.getElementById('rep-fuente').checked,
      cristal:   document.getElementById('rep-cristal').checked,
      usb:       document.getElementById('rep-usb').checked,
      software:  document.getElementById('rep-software').checked,
      esponja:   document.getElementById('rep-esponja').checked,
      otro:      document.getElementById('rep-otro-check').checked,
      otroTexto: document.getElementById('rep-otro-texto').value.trim()
    };
  }

  const scan = {
    id: 'sc_'+Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    opType: opTypeReal,
    paso, puesto, serie, serieRetira, serieNuevo, notas,
    pcNombre, scannerSerie, scannerModelo, scannerEstado, invDnd, invDnm, checklist, checklistInstalacion, actaReemplazo, fallaReparable, instalacionReemplazoData,
    assureEngine: qrAssureEngine, assureDocLib: qrAssureDocLib, assureLicKey: qrAssureLicKey,
    datosSistema: Object.keys(qrDatosSistema).length ? {...qrDatosSistema} : null,
    jiraTicket: null,
    photos: capturedPhotos.map(p=>p.dataUrl),
    pcData,
    lat: currentLocation?.lat||null,
    lon: currentLocation?.lon||null,
    address: currentLocation?.address||null,
    timestamp: new Date().toISOString()
  };

  stopCamera(); stopQRScan();

  // Aviso si no hay fotos — no bloqueante, igual que el aviso de ticket de Jira
  if (capturedPhotos.length === 0) {
    const continuar = await new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
        <div style="font-size:20px;margin-bottom:12px;text-align:center">📷</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px;text-align:center">Sin fotos adjuntas</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:20px;text-align:center;line-height:1.4">No agregaste ninguna foto al registro.<br>Se recomienda documentar el estado del equipo con al menos una foto.</div>
        <div style="display:flex;gap:10px">
          <button id="modal-foto-agregar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Agregar foto</button>
          <button id="modal-foto-continuar" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer">Guardar igual</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById('modal-foto-agregar').onclick = () => { document.body.removeChild(modal); resolve(false); };
      document.getElementById('modal-foto-continuar').onclick = () => { document.body.removeChild(modal); resolve(true); };
    });
    if (!continuar) return; // vuelve al formulario para agregar fotos
  }

  // ── MODO EDICIÓN: reemplazar registro existente ───────────
  if (editingScanId) {
    console.log('[Edit] editingScanId:', editingScanId);
    console.log('[Edit] localScans ids:', localScans.map(s=>({id:s.id,fbId:s.fbId})));
    const existingIdx = localScans.findIndex(s => s.id===editingScanId || s.fbId===editingScanId);
    console.log('[Edit] existingIdx:', existingIdx);
    const existing = existingIdx !== -1 ? localScans[existingIdx] : null;
    // Preservar campos que no se pueden cambiar desde el formulario
    // editingScanId puede ser el id local (sc_...) o el fbId de Firestore
    // Lo usamos directamente como fbId si existing no lo tiene definido
    const editFbId = (existing?.fbId) ||
      (editingScanId?.startsWith('sc_') ? null : editingScanId) || null;
    if (existing || editFbId) {
      scan.id        = existing?.id        || editingScanId;
      scan.fbId      = editFbId;
      scan.timestamp = existing?.timestamp || scan.timestamp;
      scan.userId    = existing?.userId    || currentUser.id;
      scan.userName  = existing?.userName  || currentUser.name;
      scan.photoUrls = existing?.photoUrls || [];
      // Reemplazar en el array — eliminar TODOS los duplicados con mismo id/fbId
      localScans = localScans.filter(s =>
        s.id !== (existing?.id || editingScanId) &&
        (editFbId ? s.fbId !== editFbId : true)
      );
      localScans.push(scan);
    }
    editingScanId = null;
    // Restaurar botón guardar
    const btnGuardar = document.getElementById('btn-save-scan');
    if (btnGuardar) { btnGuardar.textContent = '✓ Guardar Registro'; btnGuardar.style.background = ''; }
  } else {
    localScans.push(scan);
  }
  // Persist photos to localStorage — survives app close/reload
  if (scan.photos && scan.photos.length > 0) {
    try { localStorage.setItem('scancheck_photos_' + scan.id, JSON.stringify(scan.photos)); } catch(e) { console.warn('Photo storage failed:', e.message); }
  }
  // Persist scan list (without photos, to save space)
  try {
    const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats(); renderTodayList();
  showPage('home');
  showToast('✓ Scanner registrado','success');

  // Save to Firebase (or queue if offline)
  // En modo edición usamos updateDoc sobre el documento existente (mismo fbId)
  // En modo creación usamos addDoc (fbSaveScan devuelve el nuevo fbId)
  // Fallback: si el bloque de edición en memoria no encontró el existing y no
  // asignó fbId, lo tomamos directamente de editingScanId para no crear duplicado
  // Si estábamos editando pero el bloque de memoria no encontró el scan (raro),
  // buscamos el fbId directamente para no crear un duplicado con fbSaveScan
  if (!scan.fbId && editingScanId) {
    const src = localScans.find(s => s.id===editingScanId || s.fbId===editingScanId);
    if (src?.fbId) scan.fbId = src.fbId;
  }
  const isEdit = !!scan.fbId;
  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      let fbId;
      if (isEdit) {
        try {
          await fbReplaceScan(scan.fbId, {...scan});
          console.log('[Edit] Firestore reemplazado OK, fbId:', scan.fbId);
          fbId = scan.fbId;
        } catch(e) {
          console.error('[Edit] ERROR en fbReplaceScan:', e.message);
          fbId = scan.fbId;
        }
      } else {
        // Verificar que no exista ya un documento con este id local en Firestore
        // (puede pasar si una edición anterior falló a medias y quedó un fbId huérfano)
        // Si existe, usamos fbReplaceScan en vez de crear un duplicado
        const existingInFb = (await window.fbGetMyScans(scan.userId))
          .find(s => s.id === scan.id && s.fbId && s.fbId !== scan.fbId);
        if (existingInFb?.fbId) {
          console.warn('[Save] Documento duplicado detectado, reemplazando en vez de crear:', existingInFb.fbId);
          await fbReplaceScan(existingInFb.fbId, {...scan, fbId: existingInFb.fbId});
          fbId = existingInFb.fbId;
        } else {
          fbId = await fbSaveScan(scan);
        }
      }
      // Importante: guardar el fbId devuelto tanto en el objeto en memoria como
      // en localStorage. Sin esto, si el técnico borra el registro en la MISMA
      // sesión (sin recargar la página), deleteScanFromModal() no encuentra
      // fbId y el borrado lógico nunca llega a tocar Firestore — el registro
      // "eliminado" reaparecería intacto al recargar.
      scan.fbId = fbId;
      const idx = localScans.findIndex(s => s.id === scan.id);
      if (idx !== -1) localScans[idx].fbId = fbId;
      try {
        const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
        localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
      } catch(e) {}
      setSyncStatus('ok');
      // Subir fotos a R2 en segundo plano (no bloquea el flujo principal).
      // Capturamos el fbId en una const local para que el closure de la Promise
      // siempre tenga el valor correcto independientemente del scope externo.
      if (scan.photos && scan.photos.length > 0 && navigator.onLine) {
        const scanFbId = fbId; // captura explícita para el closure
        uploadPhotosToR2(scanFbId, scan.photos).then(async urls => {
          if (urls.length > 0) {
            scan.photoUrls = urls;
            if (idx !== -1) localScans[idx].photoUrls = urls;
            // Persistir las URLs en Firestore usando updateDoc directo
            try {
              await fbUpdateScan(scanFbId, { photoUrls: urls });
              console.log(`✓ ${urls.length} foto(s) subidas a R2 y URLs guardadas en Firestore`);
            } catch(e) {
              console.warn('Error guardando photoUrls en Firestore:', e.message);
            }
          }
        }).catch(e => console.warn('Error subiendo fotos a R2:', e.message));
      }
    } catch(e) {
      setSyncStatus('error');
      queueAdd('scan', scan);
      showToast('Guardado local. Se sincronizará al reconectar','');
    }
  } else {
    queueAdd('scan', scan);
    setSyncStatus('offline');
  }
}
window.saveScan = saveScan;

// ======== VIEW SCAN MODAL ========
async function viewScan(id) {
  const scan = localScans.find(s=>(s.id===id||s.fbId===id));
  if (!scan) return;
  modalScanId = id;
  // Prioridad de fotos:
  // 1) URLs de R2 (válidas en cualquier dispositivo, preferidas)
  // 2) base64 en memoria (solo disponible en el dispositivo que las tomó)
  // 3) Cargar desde R2 si no hay nada
  let photoSrcs = scan.photoUrls && scan.photoUrls.length > 0
    ? scan.photoUrls
    : scan.photos && scan.photos.length > 0
      ? scan.photos
      : [];
  if (photoSrcs.length === 0 && navigator.onLine) {
    const scanKey = scan.fbId || scan.id;
    photoSrcs = await loadPhotosFromR2(scanKey);
    if (photoSrcs.length > 0) {
      scan.photoUrls = photoSrcs;
    }
  }
  const photos = photoSrcs.map(p=>`<img src="${p}" class="modal-photo" style="margin-bottom:6px" alt="foto">`).join('');
  document.getElementById('modal-scan-content').innerHTML = `
    ${photos||'<div style="height:70px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:12px;background:var(--bg3);border-radius:10px;margin-bottom:14px">Sin fotos</div>'}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:4px 0 6px">General</div>
    <div class="modal-fields">
      ${fTag('Paso',scan.paso)} ${fTag('Puesto',scan.puesto)}
      ${fTag('Tipo',opLabel(scan.opType))}
      ${scan.jiraTicket?fTagHtml('Jira',jiraTicketLink(scan.jiraTicket)):''}
      <div style="font-size:11px;color:var(--text3);font-family:var(--mono);grid-column:1/-1">${new Date(scan.timestamp).toLocaleString('es-AR')}</div>
      ${scan.address?`<div style="font-size:11px;color:var(--text3);grid-column:1/-1">📍 ${escHtml(scan.address)}</div>`:''}
    </div>

    ${scan.producto==='totem' ? `
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🗼 Tótem TVF</div>
    <div class="modal-fields">
      ${fTag('Serie miniPC', scan.serieMiniPC||scan.serie)} ${scan.modeloMiniPC?fTag('Modelo miniPC',scan.modeloMiniPC):''}
      ${scan.ipMiniPC?fTag('IP miniPC',scan.ipMiniPC):''} ${scan.macMiniPC?fTag('MAC miniPC',scan.macMiniPC):''}
      ${scan.serieCamara?fTag('Serie Cámara',scan.serieCamara):''} ${scan.modeloCamara?fTag('Modelo/Marca Cámara',scan.modeloCamara):''}
      ${scan.seriePantalla?fTag('Serie Pantalla',scan.seriePantalla):''} ${scan.modeloPantalla?fTag('Modelo/Marca Pantalla',scan.modeloPantalla):''}
      ${scan.invDnd?fTag('N° Inv. DND',scan.invDnd):''} ${scan.invDnm?fTag('N° Inv. DNM',scan.invDnm):''}
      ${scan.equipoReemplazado?fTag('Equipo reemplazado',scan.equipoReemplazado):''}
      ${scan.serieRetira?fTag('Retira',`${scan.mmRetira||''} ${scan.serieRetira}`):''} ${scan.serieNuevo?fTag('Nuevo',`${scan.mmNuevo||''} ${scan.serieNuevo}`):''}
    </div>
    ${scan.estadoMiniPC?`
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🖥️ Estado miniPC (script)</div>
    <div class="modal-fields">
      ${scan.estadoMiniPC.cpu?fTag('CPU',`${scan.estadoMiniPC.cpu}${scan.estadoMiniPC.cores?` (${scan.estadoMiniPC.cores} cores)`:''}`):''}
      ${scan.estadoMiniPC.ramTotal?fTag('RAM',`${scan.estadoMiniPC.ramUsada||'?'} / ${scan.estadoMiniPC.ramTotal} GB${scan.estadoMiniPC.ramPct?` (${scan.estadoMiniPC.ramPct}%)`:''}`):''}
      ${scan.estadoMiniPC.discoTotal?fTag('Disco',`${scan.estadoMiniPC.discoUsado||'?'} / ${scan.estadoMiniPC.discoTotal}${scan.estadoMiniPC.discoPct?` (${scan.estadoMiniPC.discoPct})`:''}`):''}
      ${scan.estadoMiniPC.so?fTag('SO',scan.estadoMiniPC.so):''}
      ${scan.estadoMiniPC.kernel?fTag('Kernel',scan.estadoMiniPC.kernel):''}
      ${scan.estadoMiniPC.capturadoEn?fTag('Capturado',scan.estadoMiniPC.capturadoEn):''}
    </div>` : ''}` : scan.producto==='tablet' ? `
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">📱 Tablet</div>
    <div class="modal-fields">
      ${fTag('Serie Tablet', scan.serie)} ${scan.deviceId?fTag('Device ID',scan.deviceId):''}
      ${scan.ip?fTag('IP',scan.ip):''} ${scan.mac?fTag('MAC Add',scan.mac):''}
      ${scan.serieRetira?fTag('Serie retira',scan.serieRetira):''} ${scan.deviceIdRetira?fTag('Device ID retira',scan.deviceIdRetira):''}
      ${scan.serieNuevo?fTag('Serie nueva',scan.serieNuevo):''} ${scan.deviceIdNuevo?fTag('Device ID nueva',scan.deviceIdNuevo):''}
    </div>` : `
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🖨 Scanner DESKO</div>
    <div class="modal-fields">
      ${scan.scannerSerie?fTag('Serie',scan.scannerSerie):''} ${scan.scannerModelo?fTag('Modelo',scan.scannerModelo):''}
      ${scan.scannerEstado?fTag('Estado',scan.scannerEstado):''}
      ${scan.invDnd?fTag('N° Inv. DND',scan.invDnd):''} ${scan.invDnm?fTag('N° Inv. DNM',scan.invDnm):''}
      ${scan.serieRetira?fTag('Serie retira',scan.serieRetira):''} ${scan.serieNuevo?fTag('Serie nueva',scan.serieNuevo):''}
      ${scan.instalacionReemplazoData?fTag('Equipo retirado',`${scan.instalacionReemplazoData.marcaVieja} — ${scan.instalacionReemplazoData.serieVieja}`):''}
    </div>

    ${(scan.assureEngine && scan.assureEngine!=='No instalado')?`
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🔑 AssureID</div>
    <div class="modal-fields">
      ${fTag('Engine',scan.assureEngine)} ${fTag('DocLib',scan.assureDocLib)}
      ${scan.assureLicKey&&scan.assureLicKey!=='N/A'?fTag('License Key',scan.assureLicKey):''}
    </div>`:''}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">💻 PC</div>
    <div class="modal-fields">
      ${scan.pcNombre?fTag('Nombre PC',scan.pcNombre):''} ${fTag('Serie PC',scan.serie)}
    </div>
    ${datosSistemaHtml(scan.datosSistema)}`}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">✅ Checklists</div>
    ${scan.checklistItems?checklistItemsHtml(scan.checklistItems):(scan.opType==='instalacion_nueva'||scan.opType==='instalacion_reemplazo'?checklistInstalacionHtml(scan.checklistInstalacion):checklistHtml(scan.checklist))}
    ${scan.opType==='reemplazo'?fallaChecklistHtml(scan.actaReemplazo):''}
    ${scan.opType==='falla_reparable'?fallaReparableHtml(scan.fallaReparable):''}
    ${scan.opType==='cambio_equipo'?fallaChecklistHtml(scan.actaReemplazo):''}

    ${scan.notas?`<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">📝 Notas</div><div class="modal-notas">${notasListHtml(scan.notas)}</div>`:''}

    ${scan.opType==='reemplazo'||scan.opType==='cambio_equipo'?`<button class="btn-secondary" style="margin-top:10px;width:100%" onclick="downloadActaReemplazo('${id}')">📄 Descargar Acta de Reemplazo</button>`:''}

    ${!scanTieneInforme(scan) ? `<button class="btn-secondary" style="margin-top:12px;width:100%;border-color:var(--accent);color:var(--accent)" onclick="editScan('${id}')">✏️ Editar registro</button>` : ''}
  `;
  document.getElementById('modal-scan').classList.remove('hidden');
}
window.viewScan = viewScan;

// Devuelve true si el scan ya tiene informe cerrado (en cuyo caso no se puede editar)
function scanTieneInforme(scan) {
  const id = scan.id || scan.fbId;
  return localReports.some(r =>
    !r.eliminado && (r.scanIds||[]).some(sid => sid === id || sid === scan.id || sid === scan.fbId)
  );
}

// Abre el formulario de registro pre-completado con los datos del scan para editarlo
function editScan(id) {
  const scan = localScans.find(s => s.id===id || s.fbId===id);
  if (!scan) return;
  if (scanTieneInforme(scan)) { showToast('Este registro ya tiene informe — no se puede editar','error'); return; }

  // Cerrar el modal actual
  document.getElementById('modal-scan').classList.add('hidden');

  // Guardar referencia al scan que se está editando
  editingScanId = id;

  // Navegar al formulario — resetNewScanForm() se llama automáticamente dentro de showPage
  // IMPORTANTE: guardamos el ID antes de llamar showPage porque resetNewScanForm()
  // limpia editingScanId. Lo restauramos dentro del setTimeout.
  const savedEditId = id;
  window._keepEditId = true; // evitar que resetNewScanForm limpie editingScanId
  editingScanId = savedEditId; // setear ANTES del showPage
  showPage('new-scan');

  setTimeout(() => {
    // Confirmar editingScanId por si algo lo limpió
    editingScanId = savedEditId;
    // Preseleccionar el tipo de operación
    const opKey = scan.opType==='mantenimiento' ? 'mantenimiento'
                : (scan.opType==='instalacion_nueva'||scan.opType==='instalacion_reemplazo') ? 'instalacion'
                : 'incidencia';
    const opBtn = document.querySelector(`.op-btn[data-op="${opKey}"]`);
    if (opBtn) setOpType(opKey, opBtn);

    // Restaurar el SUBTIPO del registro, no el que quedó de la carga anterior.
    // setOpType() reaplica la variable global (que arranca en 'instalacion_nueva'
    // y 'cambio_equipo'), así que sin esto, al editar una "Instalación - Reemplazo"
    // el formulario mostraba "Puesto nuevo", ocultaba los campos del equipo
    // retirado, y al guardar el registro CAMBIABA de tipo perdiendo esos datos.
    // Lo mismo pasaba al editar una "Falla reparable": se convertía en "Cambio de equipo".
    if (opKey === 'instalacion' && (scan.opType === 'instalacion_nueva' || scan.opType === 'instalacion_reemplazo')) {
      setInstalacionSubtipo(scan.opType);
    } else if (opKey === 'incidencia' && (scan.opType === 'cambio_equipo' || scan.opType === 'falla_reparable')) {
      setIncidenciaSubtipo(scan.opType);
    }

    // Pre-completar campos
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
    setVal('inp-paso', scan.paso);
    setVal('inp-puesto', scan.puesto);
    setVal('inp-serie', scan.serie);
    setVal('inp-pc-nombre', scan.pcNombre);
    setVal('inp-scanner-serie', scan.scannerSerie);
    setVal('inp-scanner-modelo', scan.scannerModelo);
    setVal('inp-notas', scan.notas);
    setVal('inp-inv-dnd', scan.invDnd);
    setVal('inp-inv-dnm', scan.invDnm);

    // Estado scanner
    const estadoEl = document.getElementById('inp-scanner-estado');
    if (estadoEl && scan.scannerEstado) {
      estadoEl.value = scan.scannerEstado;
      estadoEl.classList.toggle('select-placeholder', !scan.scannerEstado);
    }

    // Series incidencia / cambio equipo
    if (scan.serieRetira) setVal('inp-serie-retira', scan.serieRetira);
    if (scan.serieNuevo)  setVal('inp-serie-nuevo',  scan.serieNuevo);
    if (scan.actaReemplazo?.nuevoMarcaModelo) setVal('inp-nuevo-marca-modelo', scan.actaReemplazo.nuevoMarcaModelo);

    // Instalación con reemplazo: datos del equipo del contrato anterior que se
    // retira. Sin esto, al reeditar quedaban vacíos y se pisaban al guardar.
    if (scan.instalacionReemplazoData) {
      setVal('inp-marca-vieja', scan.instalacionReemplazoData.marcaVieja);
      setVal('inp-inst-serie-retira', scan.instalacionReemplazoData.serieVieja);
    }

    // Restaurar datos del QR en variables globales y el preview
    if (scan.datosSistema) {
      Object.assign(qrDatosSistema, scan.datosSistema);
      const preview = Object.entries(scan.datosSistema).map(([k,v])=>`${k}: ${v}`).join('\n');
      const el = document.getElementById('qr-data-preview');
      if (el) { el.textContent = preview; el.classList.remove('hidden'); }
    }

    // Restaurar fotos — las URLs de R2 se usan como thumbnails
    capturedPhotos = (scan.photoUrls||scan.photos||[]).map(p =>
      typeof p === 'string' ? { dataUrl: p, info: '' } : p
    );
    renderPhotosGrid();

    // Restaurar checklist — mapeo explícito porque las claves del objeto (camelCase)
    // no coinciden directamente con los IDs del HTML (kebab-case)
    if (scan.checklist) {
      const chkMap = {
        vidrio:             'chk-vidrio',
        cableUsb:           'chk-cable-usb',
        fuente:             'chk-fuente',
        limpieza:           'chk-limpieza',
        updateAssureId:     'chk-update-assureid',
        updateLibrerias:    'chk-update-librerias',
        autoInicioDocAuth:  'chk-autoinicio-doc-auth',
        autoInicioSentinel: 'chk-autoinicio-sentinel',
        camaraWeb:          'chk-camara-web'
      };
      Object.entries(chkMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el) el.checked = !!scan.checklist[key];
      });
      // Restaurar marca/modelo de cámara si aplica
      if (scan.checklist.camaraWeb) {
        const det = document.getElementById('chk-camara-web-detalle');
        const marca = document.getElementById('chk-camara-web-marca');
        if (det) det.style.display = 'block';
        if (marca) marca.value = scan.checklist.camaraWebMarca || '';
      }
    }
    if (scan.checklistInstalacion) {
      const chkiMap = {
        fuenteConectada:      'chki-fuente-conectada',
        usb3:                 'chki-usb3',
        driversDesko:         'chki-drivers-desko',
        libreriasDesko:       'chki-librerias-desko',
        aplicativosDesko:     'chki-aplicativos-desko',
        assureIdLibrerias:    'chki-assureid-librerias',
        autoInicioDocAuth:    'chki-autoinicio-doc-auth',
        autoInicioSentinel:   'chki-autoinicio-sentinel',
        settingsSensitivity:  'chki-settings-sensitivity',
        pruebaRevealId:       'chki-prueba-revealid',
        pruebaSicam:          'chki-prueba-sicam',
        loggingFilter:        'chki-logging-filter'
      };
      Object.entries(chkiMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el) el.checked = !!scan.checklistInstalacion[key];
      });
    }

    // Cambiar botón Guardar a "Actualizar registro"
    const btnGuardar = document.getElementById('btn-save-scan');
    if (btnGuardar) {
      btnGuardar.textContent = '✓ Actualizar registro';
      btnGuardar.style.background = 'var(--warning)';
    }

    showToast('Editando registro — modificá los campos y guardá', 'success');
  }, 50);
}
window.editScan = editScan;

function fTag(label,val) { return val?`<div class="field-tag"><span>${label}</span><strong>${escHtml(val)}</strong></div>`:''; }
function fTagHtml(label,htmlVal) { return htmlVal?`<div class="field-tag"><span>${label}</span><strong>${htmlVal}</strong></div>`:''; }
function jiraTicketLink(key) { return key?`<a href="${JIRA_BASE_URL}/browse/${escHtml(key)}" target="_blank" style="color:var(--accent);text-decoration:underline">${escHtml(key)}</a>`:''; }

const CHECKLIST_LABELS = {
  vidrio:   'Estado de Vidrio/Vidrio protector',
  cableUsb: 'Estado Cable USB',
  fuente:   'Estado de Fuente de alimentación (15Vdc)',
  limpieza: 'Inspección visual y limpieza del scanner',
  updateAssureId:  'Actualización de AssureID',
  updateLibrerias: 'Actualización de Librerías',
  autoInicioDocAuth:  'Inicio Auto AssureID Document Authentication',
  autoInicioSentinel: 'Inicio Auto AssureID Sentinel Rest API',
  camaraWeb:          'Puesto con cámara web (foto de instalación)'
};

const CHECKLIST_INSTALACION_LABELS = {
  fuenteConectada:     'Fuente Conectada',
  usb3:                'USB 3.0',
  driversDesko:        'Drivers DESKO',
  libreriasDesko:      'Librerías DESKO',
  aplicativosDesko:    'Aplicativos DESKO',
  assureIdLibrerias:   'AssureID Librerías',
  autoInicioDocAuth:   'Inicio Auto AssureID Document Authentication',
  autoInicioSentinel:  'Inicio Auto AssureID Sentinel Rest API',
  settingsSensitivity: 'AssureID Settings/Authentication/Sensitivity Low',
  loggingFilter:       'Logging Filter Solo marcar Fatal Errors',
  pruebaRevealId:      'Prueba Reveal ID',
  pruebaSicam:         'Prueba Sicam'
};

// Renderiza el checklist de instalación como lista de items con OK/— (mismo estilo que checklistHtml)
function checklistInstalacionHtml(checklist) {
  if (!checklist) return '';
  const items = Object.keys(CHECKLIST_INSTALACION_LABELS).map(key => {
    const ok = !!checklist[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(CHECKLIST_INSTALACION_LABELS[key])}</span>
    </div>`;
  }).join('');
  return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin:8px 0">${items}</div>`;
}
function checklistInstalacionLines(checklist) {
  if (!checklist) return [];
  return Object.keys(CHECKLIST_INSTALACION_LABELS).map(key => `${checklist[key]?'OK':'—'} — ${CHECKLIST_INSTALACION_LABELS[key]}`);
}

// Renderiza el checklist como lista de items con OK/— según corresponda (para modal, vista de informe, etc.)
function checklistHtml(checklist) {
  if (!checklist) return '';
  const items = Object.keys(CHECKLIST_LABELS).map(key => {
    const ok = !!checklist[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(CHECKLIST_LABELS[key])}</span>
    </div>`;
  }).join('');
  return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin:8px 0">${items}</div>`;
}
// Checklist de "Tipo de falla detectada" (Acta de Reemplazo), para mostrar en pantalla junto al checklist general
function fallaChecklistHtml(actaReemplazo) {
  const fk = actaReemplazo?.fallaChecklist;
  if (!fk) return '';
  const items = Object.keys(FALLA_LABELS).map(key => {
    const ok = !!fk[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--warning)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(FALLA_LABELS[key])}</span>
    </div>`;
  }).join('');
  const otroItem = fk.otro ? `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:var(--warning);min-width:28px">OK</span>
      <span style="font-size:12px;color:var(--text)">Otro: ${escHtml(fk.otroTexto||'(sin especificar)')}</span>
    </div>` : '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--warning);margin-bottom:4px">TIPO DE FALLA DETECTADA (Acta de Reemplazo)</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${items}${otroItem}</div>
  </div>`;
}

const FALLA_REPARABLE_LABELS = {
  fuente:   'Falla Fuente de Alimentación',
  cristal:  'Protector de cristal roto/rayado',
  usb:      'Falla de conexión USB / Cables / comunicación con estación de trabajo',
  software: 'Problemas de configuración / Actualización de Software',
  esponja:  'Reemplazo de esponja'
};
function fallaReparableHtml(fallaReparable) {
  if (!fallaReparable) return '';
  const items = Object.keys(FALLA_REPARABLE_LABELS).map(key => {
    const ok = !!fallaReparable[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(FALLA_REPARABLE_LABELS[key])}</span>
    </div>`;
  }).join('');
  const otroItem = fallaReparable.otro ? `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:var(--accent);min-width:28px">OK</span>
      <span style="font-size:12px;color:var(--text)">Otro: ${escHtml(fallaReparable.otroTexto||'')}</span>
    </div>` : '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--accent);margin-bottom:4px">FALLA REPARADA EN SITIO</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${items}${otroItem}</div>
  </div>`;
}
function fallaReparableLines(fallaReparable) {
  if (!fallaReparable) return [];
  const lines = Object.keys(FALLA_REPARABLE_LABELS).map(key => `${fallaReparable[key]?'OK':'—'} — ${FALLA_REPARABLE_LABELS[key]}`);
  if (fallaReparable.otro) lines.push(`OK — Otro: ${fallaReparable.otroTexto||''}`);
  return lines;
}

// Muestra los datos del sistema (disco, USB, uptime) capturados del QR del ps1 v2
// Convierte el texto de notas (líneas separadas por \n, generadas automáticamente
// desde el QR o escritas a mano) en una lista visual prolija, en vez de texto
// corrido — un <div> normal colapsa los saltos de línea simples, por eso antes
// se veía todo seguido pese a tener \n internamente.
function notasListHtml(notas) {
  if (!notas || !notas.trim()) return '';
  const lineas = notas.split('\n').map(l => l.trim()).filter(Boolean);
  const items = lineas.map(linea => {
    const esAlerta = linea.startsWith('⚠');
    const texto = esAlerta ? linea.replace(/^⚠\s*/, '') : linea;
    const esSeparador = linea.startsWith('---') && linea.endsWith('---');
    if (esSeparador) {
      return `<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 2px">${escHtml(linea.replace(/-/g,'').trim())}</div>`;
    }
    return `<div style="display:flex;gap:6px;padding:2px 0;font-size:12px;color:${esAlerta?'var(--warning)':'var(--text2)'}">
      <span style="flex-shrink:0">${esAlerta?'⚠':'•'}</span>
      <span style="${esAlerta?'font-weight:600':''}">${escHtml(texto)}</span>
    </div>`;
  }).join('');
  return `<div style="margin-top:4px">${items}</div>`;
}

function datosSistemaHtml(ds) {
  if (!ds || !Object.keys(ds).length) return '';
  const smartColor = ds.discoSMART === 'Healthy' ? 'var(--accent)' : ds.discoSMART ? 'var(--warning)' : 'var(--text3)';
  const usbColor = ds.usbErrores === '0' || ds.usbErrores === 0 ? 'var(--accent)' : 'var(--danger)';
  const reinColor = ds.reinPend === 'No' ? 'var(--accent)' : 'var(--warning)';
  let rows = '';
  if (ds.uptime)      rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Uptime</span><span>${escHtml(ds.uptime)}</span></div>`;
  if (ds.ultimoRein)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Último reinicio</span><span>${escHtml(ds.ultimoRein)}</span></div>`;
  if (ds.reinPend)    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Reinicio pendiente</span><span style="color:${reinColor};font-weight:700">${escHtml(ds.reinPend)}</span></div>`;
  if (ds.updPend)     rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Updates de Windows pendientes</span><span style="color:${ds.updPend==='0'?'var(--accent)':'var(--warning)'};font-weight:700">${escHtml(ds.updPend)}</span></div>`;
  if (ds.discoModelo) rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Disco</span><span>${escHtml(ds.discoModelo)} (${escHtml(ds.discoTipo||'')})</span></div>`;
  if (ds.discoSMART)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Estado SMART</span><span style="color:${smartColor};font-weight:700">${escHtml(ds.discoSMART)}</span></div>`;
  if (ds.discoTotalGB)rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Espacio disco C:</span><span>${escHtml(ds.discoLibreGB)} GB libres / ${escHtml(ds.discoTotalGB)} GB (${escHtml(ds.discoUsoPct)}% uso)</span></div>`;
  if (ds.discoTempC && ds.discoTempC!=='N/D') rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Temp. disco</span><span>${escHtml(ds.discoTempC)}°C</span></div>`;
  if (ds.usbTotal)    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">USB detectados</span><span>${escHtml(ds.usbTotal)} disp. — <span style="color:${usbColor};font-weight:700">${escHtml(ds.usbErrores)} con error</span></span></div>`;
  if (ds.servicioEstado) {
    const servicioColor = ds.servicioEstado.toLowerCase().includes('corriendo') ? 'var(--accent)' : 'var(--warning)';
    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Servicio AssureID</span><span style="color:${servicioColor};font-weight:700">${escHtml(ds.servicioEstado)}</span></div>`;
  }
  if (ds.docLibFecha) rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">DocLib actualizado</span><span>${escHtml(ds.docLibFecha)}</span></div>`;
  if (ds.docLibRuta)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px;gap:8px"><span style="color:var(--text3);white-space:nowrap">DocLib ruta</span><span style="text-align:right;word-break:break-all">${escHtml(ds.docLibRuta)}</span></div>`;
  if (!rows) return '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:4px">💻 ESTADO DEL SISTEMA (PC)</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${rows}</div>
  </div>`;
}

// Versión para el PDF (texto plano, sin HTML) — array de líneas "OK/— — etiqueta"
function checklistLines(checklist) {
  if (!checklist) return [];
  return Object.keys(CHECKLIST_LABELS).map(key => `${checklist[key]?'OK':'—'} — ${CHECKLIST_LABELS[key]}`);
}
// Líneas del checklist de "Tipo de falla detectada" (Acta de Reemplazo), para mostrar también
// en el informe PDF general cuando el registro es un reemplazo.
function fallaChecklistLines(actaReemplazo) {
  const fk = actaReemplazo?.fallaChecklist;
  if (!fk) return [];
  const lines = Object.keys(FALLA_LABELS).map(key => `${fk[key]?'OK':'—'} — ${FALLA_LABELS[key]}`);
  if (fk.otro) lines.push(`OK — Otro: ${fk.otroTexto || '(sin especificar)'}`);
  return lines;
}

// Convierte el trazo verde de la firma (dibujado así en pantalla) a negro, solo para uso en PDFs.
// La firma en pantalla se mantiene verde; esta función no modifica el dato guardado.
function signatureToBlack(sigDataUrl) {
  return new Promise((resolve) => {
    if (!sigDataUrl) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i+3] > 0) { px[i] = 0; px[i+1] = 0; px[i+2] = 0; } // mismo alpha, RGB → negro
      }
      ctx.putImageData(data, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(sigDataUrl); // si falla la conversión, usar la original como respaldo
    img.src = sigDataUrl;
  });
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
window.closeModal = closeModal;

async function deleteScanFromModal() {
  if (!modalScanId) return;
  if (!confirm('¿Eliminar este registro?')) return;
  const scan = localScans.find(s=>(s.id===modalScanId||s.fbId===modalScanId));
  localScans = localScans.filter(s=>(s.id!==modalScanId&&s.fbId!==modalScanId));
  closeModal('modal-scan'); updateStats(); renderTodayList();
  showToast('Registro eliminado');

  // Borrado lógico — el documento sigue en Firestore (eliminado:true) para no
  // perder datos de métricas; solo deja de aparecer en la lista del técnico.
  if (scan?.fbId) {
    try { await fbSoftDeleteScan(scan.fbId, currentUser?.id); } catch(e) {}
    return;
  }

  // Si el scan local no tenía fbId guardado (se guardó offline y nunca se
  // refrescó el objeto local tras sincronizar), buscamos en Firestore un scan
  // que coincida, para no dejar el documento sin marcar — de lo contrario,
  // al recargar la app, ese registro "eliminado" reaparecería intacto desde
  // la nube, porque nunca se tocó el documento remoto.
  if (scan) {
    try {
      const remotos = await fbGetMyScans(currentUser.id);
      const match = remotos.find(s =>
        s.timestamp === scan.timestamp &&
        s.serie === scan.serie &&
        s.paso === scan.paso
      );
      if (match?.fbId) await fbSoftDeleteScan(match.fbId, currentUser?.id);
    } catch(e) {}
  }
}
window.deleteScanFromModal = deleteScanFromModal;
window.fbDeleteScan = fbDeleteScan;
window.fbGetAllReports = fbGetAllReports;
window.fbGetMyScans = fbGetMyScans;
window.getInternalScans = () => localScans;
window.getOrphanScans = getOrphanScans;
window.getInternalReports = () => localReports;
window.debugOrphans = () => {
  const reportedIds = new Set(localReports.filter(r=>!r.eliminado).flatMap(r=>r.scanIds||[]));
  console.log('reportedIds:', [...reportedIds]);
  const result = localScans.map(s=>({
    id: s.id, fbId: s.fbId, eliminado: s.eliminado,
    enInforme: reportedIds.has(s.id)||reportedIds.has(s.fbId)
  }));
  console.table(result);
  const orphans = localScans.filter(s => !s.eliminado && !reportedIds.has(s.id) && !reportedIds.has(s.fbId));
  console.log('Huérfanos encontrados:', orphans.length);
  return orphans;
};
window.fbUpdateScan = fbUpdateScan;
window.fbGetMyViajes = fbGetMyViajes;
window.fbGetAllViajes = fbGetAllViajes;
window.fbReplaceScan = fbReplaceScan;
window.fbDeleteReport = fbDeleteReport;
window.getLocalReports = () => localReports;
window.getLocalScans = () => localScans;

// ======== CLOSE DAY / REPORT ========
let pendingReportQueue = []; // cola de grupos {paso, scans} pendientes de generar informe, uno por Paso
let pendingReportTotal = 0;  // cantidad total de informes en esta tanda (para mostrar "Informe X de Y")

function closeDayReport() {
  // Buscamos TODOS los registros sin informe todavía, no solo los de hoy —
  // si un técnico se olvida de cerrar el día, esos registros no deben quedar
  // huérfanos para siempre. Se agrupan por Paso + categoría + FECHA real de
  // cada registro, así un registro del lunes nunca se mezcla con uno del
  // martes, ni con uno de otro Paso, aunque todos queden pendientes juntos.
  const reportedScanIds = new Set(localReports.flatMap(r => r.scanIds || []));
  const scans = localScans.filter(s => !reportedScanIds.has(s.id||s.fbId));
  if (!scans.length) { showToast('No hay registros pendientes','error'); return; }

  // Agrupar por Paso + categoría de ticket (Incidencia vs Solicitud) + fecha —
  // un informe independiente por cada combinación distinta, para que el tipo
  // de ticket en Jira sea siempre homogéneo (no se mezclan Mantenimiento/
  // Instalación con Incidencias) y para que días distintos del mismo Paso no
  // se mezclen entre sí si quedaron pendientes de cerrar varios días seguidos.
  // Las Incidencias además NO se agrupan entre sí ni siquiera dentro del mismo
  // Paso/día: cada equipo con falla suele corresponder a un ticket de cliente
  // distinto en Jira, así que cada registro de Incidencia genera su propio
  // informe individual.
  const categoriaDe = (opType) => (opType === 'cambio_equipo' || opType === 'falla_reparable' || opType === 'reemplazo')
    ? 'Incidencia' : 'Solicitud';

  const groups = new Map();
  scans.forEach(s => {
    const paso = (s.paso||'').trim() || '(Sin paso especificado)';
    const categoria = categoriaDe(s.opType);
    const fecha = localDateKey(s.timestamp);
    const producto = s.producto || 'scanner';
    // Incidencia: clave única por scan (id) → nunca se agrupa con otro registro.
    // Solicitud: clave por paso+categoria+fecha+PRODUCTO → un informe por producto,
    // para no mezclar scanners con tótems/tablets en el mismo informe firmado.
    const key = categoria === 'Incidencia' ? `incidencia|||${s.id||s.fbId}` : `${paso}|||${categoria}|||${fecha}|||${producto}`;
    if (!groups.has(key)) groups.set(key, { paso, categoria, fecha, producto, scans: [] });
    groups.get(key).scans.push(s);
  });

  // Ordenar los informes pendientes por fecha (más viejo primero), para que
  // el técnico los vaya firmando en orden cronológico.
  const gruposOrdenados = Array.from(groups.values()).sort((a,b) => a.fecha.localeCompare(b.fecha));

  pendingReportQueue = gruposOrdenados.map(({paso, categoria, fecha, producto, scans}) => {
    const prodLabel = (producto || scans[0]?.producto) === 'totem' ? ' [Tótem]' : ((producto || scans[0]?.producto) === 'tablet' ? ' [Tablet]' : '');
    return {
      paso: (categoria === 'Incidencia' ? `${paso} (Incidencia)` : paso) + prodLabel,
      producto: producto || scans[0]?.producto || 'scanner',
      scans,
      fecha
    };
  });
  pendingReportTotal = pendingReportQueue.length;
  showNextPendingReport();
}
window.closeDayReport = closeDayReport;

// ══════════════════════════════════════════════════════════════
// ── MÓDULO TÓTEM ──────────────────────────────────────────────
// Registro de Tótems TVF. Guarda en la MISMA colección scans con
// producto:'totem' y campos estándar (serie=serie miniPC) para que
// todo el pipeline existente (informes, sync, supervisor) funcione.
// Los checklists se guardan autodescriptivos en checklistItems
// [{label, ok}] — extensible a futuros productos (tablets).
// ══════════════════════════════════════════════════════════════
let currentTotemOpType = 'mantenimiento';
let currentTotemIncSubtipo = 'reparable';

// ======== PUNTOS DE CAPTURA (etapa 1: scaffold + navegación) ========
// Estructura espejo del tótem: mismos tipos de operación (mantenimiento /
// instalación / incidencia) y subtipos (reparable / reemplazo).
let currentPuntoOpType = 'mantenimiento';
let currentPuntoIncSubtipo = 'reparable';
let _puntoUbicacion = null; // { lat, lon, acc, direccion }

function showPuntoPage() {
  // Reset básico. Los campos de cámaras/ONU y checklists se cargan en la etapa 2.
  ['punto-nro','punto-notas','punto-direccion'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  _puntoUbicacion = null;
  const disp = document.getElementById('punto-coords-display');
  if (disp) disp.textContent = 'Sin ubicación todavía — tocá el botón para capturar coordenadas.';
  capturedPhotos = [];
  puntoSetOpType('mantenimiento');
  showPage('new-punto');
  if (typeof renderPhotosGrid === 'function') renderPhotosGrid();
}
window.showPuntoPage = showPuntoPage;

// Captura coordenadas GPS y autocompleta la dirección (reverse geocode). La
// dirección queda editable por si el técnico quiere ajustarla.
async function puntoObtenerUbicacion() {
  const disp = document.getElementById('punto-coords-display');
  const btn = document.getElementById('punto-btn-ubicacion');
  if (!navigator.geolocation) { if (disp) disp.textContent = 'Este dispositivo no permite geolocalización.'; return; }
  if (disp) disp.textContent = '⏳ Obteniendo ubicación...';
  if (btn) btn.disabled = true;
  try {
    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 }));
    const lat = pos.coords.latitude, lon = pos.coords.longitude, acc = Math.round(pos.coords.accuracy);
    _puntoUbicacion = { lat, lon, acc, direccion: '' };
    if (disp) disp.innerHTML = `📍 ${lat.toFixed(6)}, ${lon.toFixed(6)} · precisión ±${acc} m`;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18`);
      const d = await r.json();
      const dir = d.display_name || '';
      _puntoUbicacion.direccion = dir;
      const inp = document.getElementById('punto-direccion');
      if (inp && dir && !inp.value) inp.value = dir;
    } catch(e) { /* sin dirección: quedan las coordenadas */ }
  } catch(e) {
    if (disp) disp.textContent = '⚠️ No se pudo obtener la ubicación. Verificá los permisos de GPS.';
  } finally {
    if (btn) btn.disabled = false;
  }
}
window.puntoObtenerUbicacion = puntoObtenerUbicacion;

function puntoSetOpType(tipo) {
  currentPuntoOpType = tipo;
  ['mantenimiento','instalacion','incidencia'].forEach(t => {
    const btn = document.getElementById('punto-op-' + t);
    if (btn) btn.classList.toggle('active', t === tipo);
  });
  const sub = document.getElementById('punto-incidencia-subtipo');
  const chkM = document.getElementById('punto-checklist-mantenimiento');
  const chkI = document.getElementById('punto-checklist-instalacion');
  if (sub)  sub.style.display  = tipo === 'incidencia' ? 'block' : 'none';
  if (chkM) chkM.style.display = tipo === 'mantenimiento' ? 'block' : 'none';
  if (chkI) chkI.style.display = tipo === 'instalacion' ? 'block' : 'none';
  if (tipo === 'incidencia') { puntoSetIncSubtipo(currentPuntoIncSubtipo); }
  else {
    ['punto-checklist-reparable','punto-checklist-reemplazo','punto-reemplazo-fields']
      .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  }
}
window.puntoSetOpType = puntoSetOpType;

function puntoSetIncSubtipo(subt) {
  currentPuntoIncSubtipo = subt;
  const bR = document.getElementById('punto-inc-reparable');
  const bM = document.getElementById('punto-inc-reemplazo');
  if (bR) bR.classList.toggle('active', subt === 'reparable');
  if (bM) bM.classList.toggle('active', subt === 'reemplazo');
  const chkR = document.getElementById('punto-checklist-reparable');
  const chkM = document.getElementById('punto-checklist-reemplazo');
  const rf   = document.getElementById('punto-reemplazo-fields');
  if (chkR) chkR.style.display = subt === 'reparable' ? 'block' : 'none';
  if (chkM) chkM.style.display = subt === 'reemplazo' ? 'block' : 'none';
  if (rf)   rf.style.display   = subt === 'reemplazo' ? 'block' : 'none';
}
window.puntoSetIncSubtipo = puntoSetIncSubtipo;

// Stubs (se implementan en etapas siguientes) para que los botones no rompan.
function startPuntoQRScan() { showToast('Escaneo de QR de cámaras: etapa 3', ''); }
window.startPuntoQRScan = startPuntoQRScan;
function savePunto() { showToast('Guardado de punto de captura: etapa 4', ''); }
window.savePunto = savePunto;

const TOTEM_CHK = {
  mantenimiento: [
    ['tchk-coolers','Limpieza y control de funcionamiento de coolers'],
    ['tchk-minipc','Limpieza y control de funcionamiento de miniPC'],
    ['tchk-camara','Limpieza y control de funcionamiento de Cámara'],
    ['tchk-pantalla','Limpieza y control de funcionamiento de Pantalla'],
    ['tchk-cables','Control de cables periféricos y puertos de miniPC'],
    ['tchk-fuentes','Control de fuentes de alimentación'],
    ['tchk-switch-poe','Control y limpieza de switch POE'],
  ],
  instalacion: [
    ['tchki-tension','Verificar tensión de entrada 220V AC'],
    ['tchki-mda','Verificar acceso remoto con MDA'],
    ['tchki-tvf','Prueba del sistema TVF'],
    ['tchki-limpieza-pantalla','Limpieza de pantalla'],
    ['tchki-limpieza-camara','Limpieza de cámara'],
  ],
  reparable: [
    ['tchkr-fuente','Falla fuente de alimentación'],
    ['tchkr-limpieza-camara','Limpieza de cámara'],
    ['tchkr-software','Problema de configuración/actualización de software'],
    ['tchkr-cables','Falla en cables periféricos'],
    ['tchkr-coolers','Falla coolers'],
    ['tchkr-reset','MiniPC bloqueada por falla de energía (reset)'],
  ],
  reemplazo: [
    ['tchkm-minipc','Falla miniPC'],
    ['tchkm-pantalla','Pantalla rota/quemada'],
    ['tchkm-camara','Falla cámara'],
    ['tchkm-switch','Falla switch POE'],
    ['tchkm-estabilizador','Falla estabilizador'],
  ],
};

function showTotemPage() {
  // Reset del formulario
  ['totem-paso','totem-puesto','totem-serie-minipc','totem-modelo-minipc','totem-ip-minipc','totem-mac-minipc','totem-equipo-otro','totem-serie-camara','totem-modelo-camara',
   'totem-serie-pantalla','totem-modelo-pantalla','totem-inv-dnd','totem-inv-dnm','totem-notas',
   'totem-mm-retira','totem-serie-retira','totem-mm-nuevo','totem-serie-nuevo',
   'tchkr-otro-detalle','tchkm-otro-detalle'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  Object.values(TOTEM_CHK).flat().forEach(([id]) => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['tchkr-otro','tchkm-otro'].forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['tchkr-otro-wrap','tchkm-otro-wrap','totem-equipo-otro-wrap'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  const prev = document.getElementById('totem-qr-preview'); if (prev) prev.classList.add('hidden');
  window._totemEstadoMiniPC = null; // se rellena si se escanea un QR del script con estado
  capturedPhotos = [];
  totemSetOpType('mantenimiento');
  showPage('new-totem');
  renderPhotosGrid();
  requestLocation(); // autocompleta "Nombre del Paso" según la ubicación GPS
}
window.showTotemPage = showTotemPage;

function totemSetOpType(tipo) {
  currentTotemOpType = tipo;
  ['mantenimiento','instalacion','incidencia'].forEach(t => {
    const btn = document.getElementById('totem-op-' + t);
    if (btn) btn.classList.toggle('active', t === tipo);
  });
  document.getElementById('totem-incidencia-subtipo').style.display = tipo === 'incidencia' ? 'block' : 'none';
  document.getElementById('totem-checklist-mantenimiento').style.display = tipo === 'mantenimiento' ? 'block' : 'none';
  document.getElementById('totem-checklist-instalacion').style.display = tipo === 'instalacion' ? 'block' : 'none';
  if (tipo === 'incidencia') { totemSetIncSubtipo(currentTotemIncSubtipo); }
  else {
    document.getElementById('totem-checklist-reparable').style.display = 'none';
    document.getElementById('totem-checklist-reemplazo').style.display = 'none';
    document.getElementById('totem-reemplazo-fields').style.display = 'none';
  }
}
window.totemSetOpType = totemSetOpType;

function totemSetIncSubtipo(sub) {
  currentTotemIncSubtipo = sub;
  const bR = document.getElementById('totem-inc-reparable');
  const bM = document.getElementById('totem-inc-reemplazo');
  if (bR) bR.classList.toggle('active', sub === 'reparable');
  if (bM) bM.classList.toggle('active', sub === 'reemplazo');
  document.getElementById('totem-checklist-reparable').style.display = sub === 'reparable' ? 'block' : 'none';
  document.getElementById('totem-checklist-reemplazo').style.display = sub === 'reemplazo' ? 'block' : 'none';
  document.getElementById('totem-reemplazo-fields').style.display = sub === 'reemplazo' ? 'block' : 'none';
}
window.totemSetIncSubtipo = totemSetIncSubtipo;

// Escaneo de etiqueta QR: reutiliza el scanner existente; processQRData detecta el formato etiqueta
function startTotemQRScan() {
  window._esperandoEtiquetaTotem = true;
  startQRScan();
}
window.startTotemQRScan = startTotemQRScan;

// Llena el formulario de tótem desde los datos de una etiqueta {"t":"totem",...}
function fillTotemFromEtiqueta(d) {
  // Soporta dos formatos:
  //  A) Generador de la app (claves largas): serieMiniPC, modeloMiniPC, ipMiniPC, macMiniPC...
  //  B) Script de la miniPC (claves compactas): sn, mod, ip, mac + estado (cpu, rt, ru, ...)
  const serieMiniPC  = d.serieMiniPC  ?? d.sn;
  const modeloMiniPC = d.modeloMiniPC ?? d.mod;
  const ipMiniPC     = d.ipMiniPC     ?? d.ip;
  const macMiniPC    = d.macMiniPC    ?? d.mac;

  const map = {
    'totem-puesto': d.puesto,
    'totem-serie-minipc': serieMiniPC, 'totem-modelo-minipc': modeloMiniPC,
    'totem-ip-minipc': ipMiniPC, 'totem-mac-minipc': macMiniPC,
    'totem-serie-camara': d.serieCamara, 'totem-modelo-camara': d.modeloCamara,
    'totem-serie-pantalla': d.seriePantalla, 'totem-modelo-pantalla': d.modeloPantalla,
    'totem-inv-dnd': d.invDnd, 'totem-inv-dnm': d.invDnm,
  };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el && val) el.value = val; });

  // Si el QR trae estado de la miniPC (viene del script), lo guardamos para
  // adjuntarlo al registro cuando el técnico guarde el preventivo.
  if (d.cpu || d.rt || d.dt) {
    window._totemEstadoMiniPC = {
      cpu: d.cpu || '', cores: d.cor || '',
      ramTotal: d.rt || '', ramUsada: d.ru || '', ramPct: d.rp || '',
      so: d.so || '', kernel: d.ker || '',
      discoTotal: d.dt || '', discoUsado: d.du || '', discoLibre: d.dl || '', discoPct: d.dp || '',
      capturadoEn: d.ts || '',
    };
    showToast('✓ Etiqueta + estado de miniPC escaneados', 'success');
  } else {
    window._totemEstadoMiniPC = null;
    showToast('✓ Etiqueta escaneada', 'success');
  }

  const prev = document.getElementById('totem-qr-preview'); if (prev) prev.classList.remove('hidden');
  if (currentPage !== 'new-totem') showPage('new-totem');
}

async function saveTotem() {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const paso = val('totem-paso');
  const puesto = val('totem-puesto');
  const serieMiniPC = val('totem-serie-minipc');
  if (!paso) { showToast('Ingresá el nombre del paso','error'); return; }
  if (!puesto) { showToast('Ingresá el número de puesto','error'); return; }
  if (!serieMiniPC) { showToast('Ingresá la serie de la miniPC','error'); return; }

  // opType real (compatible con la categorización de informes/Jira existente)
  let opTypeReal = currentTotemOpType;
  if (currentTotemOpType === 'incidencia') {
    opTypeReal = currentTotemIncSubtipo === 'reemplazo' ? 'cambio_equipo' : 'falla_reparable';
  }

  // Checklist autodescriptivo según el tipo
  const chkKey = currentTotemOpType === 'incidencia' ? currentTotemIncSubtipo : currentTotemOpType;
  const checklistItems = TOTEM_CHK[chkKey].map(([id, label]) => ({ label, ok: !!document.getElementById(id)?.checked }));
  // Ítem "Otro" con detalle en incidencias
  if (chkKey === 'reparable' && document.getElementById('tchkr-otro')?.checked) {
    checklistItems.push({ label: 'Otro: ' + (val('tchkr-otro-detalle') || 'sin detalle'), ok: true });
  }
  if (chkKey === 'reemplazo' && document.getElementById('tchkm-otro')?.checked) {
    checklistItems.push({ label: 'Otro: ' + (val('tchkm-otro-detalle') || 'sin detalle'), ok: true });
  }

  // Datos de reemplazo
  let reemplazoData = {};
  if (opTypeReal === 'cambio_equipo') {
    let equipoR = document.getElementById('totem-equipo-reemplazo')?.value || '';
    if (equipoR === 'Otro') {
      const otroTxt = val('totem-equipo-otro');
      if (!otroTxt) { showToast('Especificá el equipo que se reemplaza','error'); return; }
      equipoR = otroTxt;
    }
    const mmRetira = val('totem-mm-retira'), serieRetira = val('totem-serie-retira');
    const mmNuevo = val('totem-mm-nuevo'), serieNuevo = val('totem-serie-nuevo');
    if (!mmRetira || !serieRetira || !mmNuevo || !serieNuevo) {
      showToast('Completá marca/modelo y serie del equipo que se retira y del nuevo','error'); return;
    }
    reemplazoData = { equipoReemplazado: equipoR, mmRetira, serieRetira, mmNuevo, serieNuevo };
  }

  // GPS igual que el scanner
  let lat=null, lon=null, address='';
  try {
    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000, maximumAge: 60000 }));
    lat = pos.coords.latitude; lon = pos.coords.longitude;
    address = window._lastKnownAddress || '';
  } catch(e) {}

  const scan = {
    id: 'totem_' + Date.now(),
    producto: 'totem',
    userId: currentUser.id,
    technicianName: currentUser.name || currentUser.email,
    timestamp: new Date().toISOString(),
    paso, puesto,
    serie: serieMiniPC, // compat con pipeline existente (informes, renders, Jira)
    serieMiniPC,
    modeloMiniPC: val('totem-modelo-minipc'),
    estadoMiniPC: window._totemEstadoMiniPC || null,
    ipMiniPC: val('totem-ip-minipc'),
    macMiniPC: val('totem-mac-minipc'),
    serieCamara: val('totem-serie-camara'),
    modeloCamara: val('totem-modelo-camara'),
    seriePantalla: val('totem-serie-pantalla'),
    modeloPantalla: val('totem-modelo-pantalla'),
    invDnd: val('totem-inv-dnd'),
    invDnm: val('totem-inv-dnm'),
    opType: opTypeReal,
    checklistItems,
    ...reemplazoData,
    serieRetira: reemplazoData.serieRetira || '',
    serieNuevo: reemplazoData.serieNuevo || '',
    notas: val('totem-notas'),
    lat, lon, address,
    photos: capturedPhotos.map(p => p.dataUrl), // array de strings, igual que saveScan
  };

  localScans.push(scan);
  if (scan.photos.length > 0) {
    try { localStorage.setItem('scancheck_photos_' + scan.id, JSON.stringify(scan.photos)); } catch(e) {}
  }
  try {
    const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats(); renderTodayList();
  showPage('home');
  showToast('✓ Tótem registrado','success');

  // Sync a Firestore (mismo mecanismo que el scanner)
  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      const fbId = await fbSaveScan(scan);
      const idx = localScans.findIndex(s => s.id === scan.id);
      if (idx !== -1) localScans[idx].fbId = fbId;
      if (scan.photos.length > 0) {
        try {
          const urls = await uploadPhotosToR2(fbId, scan.photos);
          if (urls.length) await fbUpdateScan(fbId, { photoUrls: urls });
        } catch(e) { console.warn('R2 tótem:', e.message); }
      }
      setSyncStatus('online');
    } catch(e) {
      queueAdd('scan', scan);
      setSyncStatus('offline');
    }
  } else {
    queueAdd('scan', scan);
  }
}
window.saveTotem = saveTotem;

// Helpers de producto: nombre del dispositivo según scanner/totem/tablet.
// Se usan en los conteos de informes/listas y en los encabezados de sección.
function productoDeScans(scans) {
  if (!scans || !scans.length) return 'scanner';
  return scans[0].producto || 'scanner';
}
function nombreDispositivo(producto, plural) {
  const map = {
    scanner: ['scanner', 'scanners'],
    totem:   ['tótem', 'tótems'],
    tablet:  ['tablet', 'tablets'],
  };
  const par = map[producto] || map.scanner;
  return plural ? par[1] : par[0];
}
function contarDispositivos(scans) {
  const n = scans.length;
  const prod = productoDeScans(scans);
  return `${n} ${nombreDispositivo(prod, n !== 1)}`;
}
// Encabezado de la sección de datos del equipo según producto
function tituloEquipoHtml(producto, margin) {
  const label = producto === 'totem' ? '🗼 Tótem TVF' : (producto === 'tablet' ? '📱 Tablet' : '🖨 Scanner DESKO');
  return `<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;${margin}">${label}</div>`;
}

// Bloque "datos del equipo" para informes (HTML). Recibe el scan (s) y clases
// de padding para el encabezado y los campos. Muestra los campos propios del
// producto: scanner (+ PC), tótem o tablet.
function bloqueEquipoInformeHtml(s, headStyle, fieldsClass) {
  const head = (label) => `<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;${headStyle}">${label}</div>`;
  if (s.producto === 'totem') {
    return head('🗼 Tótem TVF') + `<div class="${fieldsClass}">
      ${fTag('Serie miniPC', s.serieMiniPC||s.serie)} ${s.modeloMiniPC?fTag('Modelo miniPC',s.modeloMiniPC):''}
      ${s.ipMiniPC?fTag('IP miniPC',s.ipMiniPC):''} ${s.macMiniPC?fTag('MAC miniPC',s.macMiniPC):''}
      ${s.serieCamara?fTag('Serie Cámara',s.serieCamara):''} ${s.modeloCamara?fTag('Modelo/Marca Cámara',s.modeloCamara):''}
      ${s.seriePantalla?fTag('Serie Pantalla',s.seriePantalla):''} ${s.modeloPantalla?fTag('Modelo/Marca Pantalla',s.modeloPantalla):''}
      ${s.invDnd?fTag('N° Inv. DND',s.invDnd):''} ${s.invDnm?fTag('N° Inv. DNM',s.invDnm):''}
      ${s.equipoReemplazado?fTag('Equipo reemplazado',s.equipoReemplazado):''}
      ${s.serieRetira?fTag('Retira',`${s.mmRetira||''} ${s.serieRetira}`):''} ${s.serieNuevo?fTag('Nuevo',`${s.mmNuevo||''} ${s.serieNuevo}`):''}
    </div>`;
  }
  if (s.producto === 'tablet') {
    return head('📱 Tablet') + `<div class="${fieldsClass}">
      ${fTag('Serie Tablet', s.serie)} ${s.deviceId?fTag('Device ID',s.deviceId):''}
      ${s.ip?fTag('IP',s.ip):''} ${s.mac?fTag('MAC Add',s.mac):''}
      ${s.serieRetira?fTag('Serie retira',s.serieRetira):''} ${s.deviceIdRetira?fTag('Device ID retira',s.deviceIdRetira):''}
      ${s.serieNuevo?fTag('Serie nueva',s.serieNuevo):''} ${s.deviceIdNuevo?fTag('Device ID nueva',s.deviceIdNuevo):''}
    </div>`;
  }
  // Scanner (comportamiento original)
  return head('🖨 Scanner DESKO') + `<div class="${fieldsClass}">
      ${s.scannerSerie?fTag('Serie',s.scannerSerie):''} ${s.scannerModelo?fTag('Modelo',s.scannerModelo):''}
      ${s.scannerEstado?fTag('Estado',s.scannerEstado):''}
      ${s.invDnd?fTag('N° Inv. DND',s.invDnd):''} ${s.invDnm?fTag('N° Inv. DNM',s.invDnm):''}
      ${s.serieRetira?fTag('Serie retira',s.serieRetira):''} ${s.serieNuevo?fTag('Serie nueva',s.serieNuevo):''}
      ${s.instalacionReemplazoData?fTag('Equipo retirado',`${s.instalacionReemplazoData.marcaVieja} — ${s.instalacionReemplazoData.serieVieja}`):''}
    </div>`;
}

// Bloque "datos del equipo" formato grid-inline (viewReport / viewReportSupervisor)
function bloqueEquipoGridHtml(s, headMargin) {
  const head = (label) => `<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;${headMargin}">${label}</div>`;
  const row = (lbl, val, color) => val ? `<div style="color:var(--text2)">${lbl}: <span style="color:${color||'var(--text)'}">${escHtml(String(val))}</span></div>` : '';
  const open = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;font-family:var(--mono)">';
  if (s.producto === 'totem') {
    return head('🗼 Tótem TVF') + open +
      row('Serie miniPC', s.serieMiniPC||s.serie) + row('Modelo miniPC', s.modeloMiniPC) +
      row('IP miniPC', s.ipMiniPC) + row('MAC miniPC', s.macMiniPC) +
      row('Serie Cámara', s.serieCamara) + row('Modelo/Marca Cámara', s.modeloCamara) +
      row('Serie Pantalla', s.seriePantalla) + row('Modelo/Marca Pantalla', s.modeloPantalla) +
      row('N° Inv. DND', s.invDnd) + row('N° Inv. DNM', s.invDnm) +
      row('Equipo reemplazado', s.equipoReemplazado) +
      row('Retira', s.serieRetira?`${s.mmRetira||''} ${s.serieRetira}`:'', 'var(--warning)') +
      row('Nuevo', s.serieNuevo?`${s.mmNuevo||''} ${s.serieNuevo}`:'', 'var(--accent)') +
      '</div>';
  }
  if (s.producto === 'tablet') {
    return head('📱 Tablet') + open +
      row('Serie Tablet', s.serie) + row('Device ID', s.deviceId) +
      row('IP', s.ip) + row('MAC Add', s.mac) +
      row('Serie retira', s.serieRetira, 'var(--warning)') + row('Device ID retira', s.deviceIdRetira) +
      row('Serie nueva', s.serieNuevo, 'var(--accent)') + row('Device ID nueva', s.deviceIdNuevo) +
      '</div>';
  }
  return head('🖨 Scanner DESKO') + open +
    row('Serie', s.scannerSerie) + row('Modelo', s.scannerModelo) + row('Estado', s.scannerEstado) +
    row('N° Inv. DND', s.invDnd) + row('N° Inv. DNM', s.invDnm) +
    row('Serie retira', s.serieRetira, 'var(--warning)') + row('Serie nueva', s.serieNuevo, 'var(--accent)') +
    (s.instalacionReemplazoData?`<div style="color:var(--text2);grid-column:1/-1">Equipo retirado: <span style="color:var(--text)">${escHtml(s.instalacionReemplazoData.marcaVieja)} — ${escHtml(s.instalacionReemplazoData.serieVieja)}</span></div>`:'') +
    '</div>';
}

// Render del checklist autodescriptivo (tótem y futuros productos)
function checklistItemsHtml(items) {
  if (!items || !items.length) return '';
  const rows = items.map(it => `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
    <span style="font-size:12px;font-weight:700;color:${it.ok?'var(--accent)':'var(--text3)'};min-width:28px">${it.ok?'OK':'—'}</span>
    <span style="font-size:12px;color:${it.ok?'var(--text)':'var(--text3)'}">${escHtml(it.label)}</span>
  </div>`).join('');
  return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin:8px 0">${rows}</div>`;
}
function checklistItemsLines(items) {
  if (!items || !items.length) return [];
  return items.map(it => `${it.ok?'OK':'—'} — ${it.label}`);
}
// ══════════════════════════════════════════════════════════════
// ── MÓDULO TABLET ─────────────────────────────────────────────
// Mismo patrón que el módulo Tótem: guarda en la colección scans
// con producto:'tablet'. serie=serie de la tablet.
// ══════════════════════════════════════════════════════════════
let currentTabletOpType = 'mantenimiento';
let currentTabletIncSubtipo = 'reparable';

const TABLET_CHK = {
  mantenimiento: [
    ['tbchk-pantalla','Estado/Limpieza de pantalla'],
    ['tbchk-camara','Estado/Limpieza de Cámara'],
    ['tbchk-carcasa','Estado/Limpieza de Carcasa'],
    ['tbchk-arnes','Estado de Arnés'],
    ['tbchk-kiosko','Modo Kiosko Activado'],
    ['tbchk-pin-carga','Estado Pin de carga'],
    ['tbchk-wifi','Conexión WiFi'],
    ['tbchk-software','Actualización de Software'],
  ],
  instalacion: [
    ['tbchki-red','Configuración de red'],
    ['tbchki-wifi-auto','Verificar que conecte a WiFi automáticamente luego de perder señal'],
    ['tbchki-kiosko','Activar modo Kiosko'],
    ['tbchki-reinicio','Reiniciar y verificar que inicie en modo Kiosko'],
    ['tbchki-tvf-mobile','Prueba de software TVF Mobile'],
  ],
  reparable: [
    ['tbchkr-software','Configuración/Actualización de software'],
    ['tbchkr-limpieza','Limpieza'],
    ['tbchkr-cargador','Falla cargador'],
  ],
  reemplazo: [
    ['tbchkm-pantalla','Pantalla rota'],
    ['tbchkm-pin','Falla Pin de carga'],
    ['tbchkm-bateria','Falla batería'],
    ['tbchkm-camara','Cámara rayada/rota'],
  ],
};

function showTabletPage() {
  ['tablet-paso','tablet-puesto','tablet-serie','tablet-device-id','tablet-ip','tablet-mac','tablet-notas',
   'tablet-serie-retira','tablet-deviceid-retira','tablet-serie-nueva','tablet-deviceid-nueva',
   'tbchkr-otro-detalle','tbchkm-otro-detalle'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  Object.values(TABLET_CHK).flat().forEach(([id]) => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['tbchkr-otro','tbchkm-otro'].forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['tbchkr-otro-wrap','tbchkm-otro-wrap'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  const prev = document.getElementById('tablet-qr-preview'); if (prev) prev.classList.add('hidden');
  capturedPhotos = [];
  tabletSetOpType('mantenimiento');
  showPage('new-tablet');
  renderPhotosGrid();
  requestLocation(); // autocompleta "Nombre del Paso" según la ubicación GPS
}
window.showTabletPage = showTabletPage;

function tabletSetOpType(tipo) {
  currentTabletOpType = tipo;
  ['mantenimiento','instalacion','incidencia'].forEach(t => {
    const btn = document.getElementById('tablet-op-' + t);
    if (btn) btn.classList.toggle('active', t === tipo);
  });
  document.getElementById('tablet-incidencia-subtipo').style.display = tipo === 'incidencia' ? 'block' : 'none';
  document.getElementById('tablet-checklist-mantenimiento').style.display = tipo === 'mantenimiento' ? 'block' : 'none';
  document.getElementById('tablet-checklist-instalacion').style.display = tipo === 'instalacion' ? 'block' : 'none';
  if (tipo === 'incidencia') { tabletSetIncSubtipo(currentTabletIncSubtipo); }
  else {
    document.getElementById('tablet-checklist-reparable').style.display = 'none';
    document.getElementById('tablet-checklist-reemplazo').style.display = 'none';
    document.getElementById('tablet-reemplazo-fields').style.display = 'none';
  }
}
window.tabletSetOpType = tabletSetOpType;

function tabletSetIncSubtipo(sub) {
  currentTabletIncSubtipo = sub;
  const bR = document.getElementById('tablet-inc-reparable');
  const bM = document.getElementById('tablet-inc-reemplazo');
  if (bR) bR.classList.toggle('active', sub === 'reparable');
  if (bM) bM.classList.toggle('active', sub === 'reemplazo');
  document.getElementById('tablet-checklist-reparable').style.display = sub === 'reparable' ? 'block' : 'none';
  document.getElementById('tablet-checklist-reemplazo').style.display = sub === 'reemplazo' ? 'block' : 'none';
  document.getElementById('tablet-reemplazo-fields').style.display = sub === 'reemplazo' ? 'block' : 'none';
}
window.tabletSetIncSubtipo = tabletSetIncSubtipo;

function startTabletQRScan() {
  window._esperandoEtiquetaTablet = true;
  startQRScan();
}
window.startTabletQRScan = startTabletQRScan;

function fillTabletFromEtiqueta(d) {
  const map = {
    'tablet-puesto': d.puesto,
    'tablet-serie': d.serie, 'tablet-device-id': d.deviceId,
    'tablet-ip': d.ip, 'tablet-mac': d.mac,
  };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el && val) el.value = val; });
  const prev = document.getElementById('tablet-qr-preview'); if (prev) prev.classList.remove('hidden');
  if (currentPage !== 'new-tablet') showPage('new-tablet');
  showToast('✓ Etiqueta escaneada', 'success');
}

async function saveTablet() {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const paso = val('tablet-paso');
  const puesto = val('tablet-puesto');
  const serie = val('tablet-serie');
  if (!paso) { showToast('Ingresá el nombre del paso','error'); return; }
  if (!puesto) { showToast('Ingresá el número de puesto','error'); return; }
  if (!serie) { showToast('Ingresá la serie de la tablet','error'); return; }

  let opTypeReal = currentTabletOpType;
  if (currentTabletOpType === 'incidencia') {
    opTypeReal = currentTabletIncSubtipo === 'reemplazo' ? 'cambio_equipo' : 'falla_reparable';
  }

  const chkKey = currentTabletOpType === 'incidencia' ? currentTabletIncSubtipo : currentTabletOpType;
  const checklistItems = TABLET_CHK[chkKey].map(([id, label]) => ({ label, ok: !!document.getElementById(id)?.checked }));
  if (chkKey === 'reparable' && document.getElementById('tbchkr-otro')?.checked) {
    checklistItems.push({ label: 'Otro: ' + (val('tbchkr-otro-detalle') || 'sin detalle'), ok: true });
  }
  if (chkKey === 'reemplazo' && document.getElementById('tbchkm-otro')?.checked) {
    checklistItems.push({ label: 'Otro: ' + (val('tbchkm-otro-detalle') || 'sin detalle'), ok: true });
  }

  let reemplazoData = {};
  if (opTypeReal === 'cambio_equipo') {
    const serieRetira = val('tablet-serie-retira'), serieNuevo = val('tablet-serie-nueva');
    const deviceIdRetira = val('tablet-deviceid-retira'), deviceIdNuevo = val('tablet-deviceid-nueva');
    if (!serieRetira || !serieNuevo) {
      showToast('Completá la serie de la tablet que se retira y de la nueva','error'); return;
    }
    reemplazoData = { serieRetira, serieNuevo, deviceIdRetira, deviceIdNuevo };
  }

  let lat=null, lon=null, address='';
  try {
    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000, maximumAge: 60000 }));
    lat = pos.coords.latitude; lon = pos.coords.longitude;
    address = window._lastKnownAddress || '';
  } catch(e) {}

  const scan = {
    id: 'tablet_' + Date.now(),
    producto: 'tablet',
    userId: currentUser.id,
    technicianName: currentUser.name || currentUser.email,
    timestamp: new Date().toISOString(),
    paso, puesto,
    serie, // compat con pipeline existente
    deviceId: val('tablet-device-id'),
    ip: val('tablet-ip'),
    mac: val('tablet-mac'),
    opType: opTypeReal,
    checklistItems,
    ...reemplazoData,
    serieRetira: reemplazoData.serieRetira || '',
    serieNuevo: reemplazoData.serieNuevo || '',
    notas: val('tablet-notas'),
    lat, lon, address,
    photos: capturedPhotos.map(p => p.dataUrl),
  };

  localScans.push(scan);
  if (scan.photos.length > 0) {
    try { localStorage.setItem('scancheck_photos_' + scan.id, JSON.stringify(scan.photos)); } catch(e) {}
  }
  try {
    const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats(); renderTodayList();
  showPage('home');
  showToast('✓ Tablet registrada','success');

  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      const fbId = await fbSaveScan(scan);
      const idx = localScans.findIndex(s => s.id === scan.id);
      if (idx !== -1) localScans[idx].fbId = fbId;
      if (scan.photos.length > 0) {
        try {
          const urls = await uploadPhotosToR2(fbId, scan.photos);
          if (urls.length) await fbUpdateScan(fbId, { photoUrls: urls });
        } catch(e) { console.warn('R2 tablet:', e.message); }
      }
      setSyncStatus('online');
    } catch(e) {
      queueAdd('scan', scan);
      setSyncStatus('offline');
    }
  } else {
    queueAdd('scan', scan);
  }
}
window.saveTablet = saveTablet;
// ── FIN MÓDULO TABLET ─────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// ── GESTIÓN DE FLOTA ──────────────────────────────────────────
// Sección solo para administrador (currentUser.role==='supervisor').
// Vehículos, hidrogrúas (equipos independientes), eventos (combustible,
// peaje, service, avería) y parámetros de amortización editables.
// ══════════════════════════════════════════════════════════════

// Parámetros por defecto (editables desde la app). Vida útil híbrida:
// se amortiza por lo que ocurra primero (años o km/horas).
const FLOTA_PARAMS_DEFAULT = {
  // serviceKm / serviceHoras: intervalo de service. Si serviceHoras > 0, el service
  // se evalúa por km Y por horas de motor, lo que ocurra primero (las unidades con
  // hidrogrúa acumulan muchas horas al ralentí sin sumar km).
  tiposVehiculo: {
    auto:          { label: 'Auto',                    anios: 6,  km: 200000, residualPct: 25, serviceKm: 10000, serviceHoras: 0 },
    utilitario:    { label: 'Utilitario',              anios: 7,  km: 250000, residualPct: 20, serviceKm: 10000, serviceHoras: 0 },
    furgon:        { label: 'Furgón grande',           anios: 8,  km: 350000, residualPct: 20, serviceKm: 15000, serviceHoras: 0 },
    camioneta_grua:{ label: 'Camioneta c/ hidrogrúa',  anios: 8,  km: 300000, residualPct: 30, serviceKm: 15000, serviceHoras: 300 },
    camion_grua:   { label: 'Camión c/ hidrogrúa',     anios: 12, km: 600000, residualPct: 25, serviceKm: 20000, serviceHoras: 400 },
  },
  grua: { anios: 15, horas: 10000, residualPct: 20, serviceHoras: 250 },
  combustible: { nafta: 0, gasoil: 0, actualizado: '' }, // precio $/litro, editable
  // Anticipación con la que se avisa el próximo service
  alarmas: { margenKm: 1000, margenHoras: 100 },
  // Documentación con vencimiento. Cada unidad guarda la fecha en documentos[id].
  // margenDias = con cuánta anticipación avisar. aplicaA: vehiculo | grua | ambos.
  documentos: [
    { id: 'vtv',         label: 'VTV',                    aplicaA: 'vehiculo', margenDias: 30 },
    { id: 'seguro',      label: 'Seguro (póliza)',        aplicaA: 'vehiculo', margenDias: 30 },
    { id: 'patente',     label: 'Patente / impuesto',     aplicaA: 'vehiculo', margenDias: 15 },
    { id: 'matafuegos',  label: 'Matafuegos',             aplicaA: 'ambos',    margenDias: 30 },
    { id: 'ruta',        label: 'RUTA',                   aplicaA: 'vehiculo', margenDias: 30 },
    { id: 'certif_grua', label: 'Certificación de grúa',  aplicaA: 'grua',     margenDias: 30 },
  ],
};
let _flotaParams = null;
let _flotaVehiculos = [];
let _flotaGruas = [];
let _flotaEventos = [];

function showFlotaPage() {
  if (currentUser.role !== 'supervisor') { showToast('Acceso solo para administrador', 'error'); return; }
  showPage('flota');
  flotaTab('vehiculos', document.getElementById('flota-tab-vehiculos'));
  cargarFlota();
}
window.showFlotaPage = showFlotaPage;

function flotaTab(tab, btn) {
  ['vehiculos','gruas','alarmas','costos','parametros'].forEach(t => {
    const panel = document.getElementById('flota-' + t);
    if (panel) panel.classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('#page-flota .sup-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (tab === 'parametros') renderFlotaParametros();
  if (tab === 'alarmas') renderFlotaAlarmas();
  if (tab === 'costos') renderFlotaCostos();
}
window.flotaTab = flotaTab;

async function cargarFlota() {
  const vc = document.getElementById('flota-vehiculos-content');
  if (vc) vc.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)">Cargando...</div>';
  try {
    _flotaParams = (await fbGetFlotaParametros()) || FLOTA_PARAMS_DEFAULT;
    // Completar claves que falten con los defaults (para params viejos)
    _flotaParams = { ...FLOTA_PARAMS_DEFAULT, ..._flotaParams,
      tiposVehiculo: { ...FLOTA_PARAMS_DEFAULT.tiposVehiculo, ...(_flotaParams.tiposVehiculo||{}) } };
    _flotaVehiculos = await fbGetFlotaVehiculos();
    _flotaGruas = await fbGetFlotaGruas();
    _flotaEventos = await fbGetFlotaEventos(); // todos, para calcular costos
    renderFlotaVehiculos();
    renderFlotaGruas();
  } catch(e) {
    if (vc) vc.innerHTML = `<div style="text-align:center;padding:30px;color:#e55">Error: ${escHtml(e.message)}</div>`;
  }
}

// ── Parámetros editables ──
function renderFlotaParametros() {
  const cont = document.getElementById('flota-parametros-content');
  if (!cont) return;
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  const filaTipo = (key, t) => `
    <tr>
      <td style="padding:8px;font-size:12px;color:var(--text)">${escHtml(t.label)}</td>
      <td style="padding:4px"><input type="number" id="fp-${key}-anios" value="${t.anios}" style="width:52px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
      <td style="padding:4px"><input type="number" id="fp-${key}-km" value="${t.km}" style="width:74px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
      <td style="padding:4px"><input type="number" id="fp-${key}-res" value="${t.residualPct}" style="width:44px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
      <td style="padding:4px"><input type="number" id="fp-${key}-svckm" value="${t.serviceKm||0}" style="width:66px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
      <td style="padding:4px"><input type="number" id="fp-${key}-svchs" value="${t.serviceHoras||0}" style="width:52px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
    </tr>`;
  cont.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
      <h3 style="margin:0 0 4px">Vida útil y service por tipo de vehículo</h3>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">La amortización corre por lo que ocurra primero: años o km. Residual = % del valor de compra que se recupera al final.<br>
      <strong>Service hs:</strong> si es mayor a 0, el service se evalúa también por horas de motor (lo que ocurra primero). Útil en unidades con hidrogrúa que quedan al ralentí. Dejar en 0 para evaluar solo por km.</div>
      <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:460px">
        <tr style="text-align:left">
          <th style="font-size:10px;color:var(--text3);padding:4px">Tipo</th>
          <th style="font-size:10px;color:var(--text3);padding:4px">Años</th>
          <th style="font-size:10px;color:var(--text3);padding:4px">Km vida</th>
          <th style="font-size:10px;color:var(--text3);padding:4px">Res.%</th>
          <th style="font-size:10px;color:var(--text3);padding:4px">Service km</th>
          <th style="font-size:10px;color:var(--text3);padding:4px">Service hs</th>
        </tr>
        ${Object.entries(p.tiposVehiculo).map(([k,t]) => filaTipo(k,t)).join('')}
      </table>
      </div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
      <h3 style="margin:0 0 10px">Hidrogrúa (amortización por horas)</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
        <div><label style="font-size:11px;color:var(--text3)">Años</label><input type="number" id="fp-grua-anios" value="${p.grua.anios}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
        <div><label style="font-size:11px;color:var(--text3)">Horas vida</label><input type="number" id="fp-grua-horas" value="${p.grua.horas}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
        <div><label style="font-size:11px;color:var(--text3)">Res.%</label><input type="number" id="fp-grua-res" value="${p.grua.residualPct}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
        <div><label style="font-size:11px;color:var(--text3)">Service hs</label><input type="number" id="fp-grua-svchs" value="${p.grua.serviceHoras||250}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
      </div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
      <h3 style="margin:0 0 10px">Alarmas de service (anticipación)</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label style="font-size:11px;color:var(--text3)">Avisar con X km antes</label><input type="number" id="fp-margen-km" value="${p.alarmas?.margenKm ?? 1000}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
        <div><label style="font-size:11px;color:var(--text3)">Avisar con X horas antes</label><input type="number" id="fp-margen-hs" value="${p.alarmas?.margenHoras ?? 100}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
      </div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
      <h3 style="margin:0 0 10px">Precio de combustible ($/litro)</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label style="font-size:11px;color:var(--text3)">Nafta</label><input type="number" step="0.01" id="fp-nafta" value="${p.combustible?.nafta||0}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
        <div><label style="font-size:11px;color:var(--text3)">Gasoil</label><input type="number" step="0.01" id="fp-gasoil" value="${p.combustible?.gasoil||0}" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text)"></div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:6px">Actualización manual. A futuro se automatizará con precios de referencia YPF.</div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px">
      <h3 style="margin:0 0 4px">Documentación con vencimiento</h3>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">La fecha de cada documento se carga en la ficha de cada unidad. Acá definís qué documentos se controlan y con cuánta anticipación avisar.</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:420px">
          <tr style="text-align:left">
            <th style="font-size:10px;color:var(--text3);padding:4px">Documento</th>
            <th style="font-size:10px;color:var(--text3);padding:4px">Aplica a</th>
            <th style="font-size:10px;color:var(--text3);padding:4px">Avisar (días)</th>
            <th style="padding:4px"></th>
          </tr>
          ${(p.documentos||[]).map((d,i) => `
            <tr>
              <td style="padding:4px"><input type="text" id="fp-doc-${i}-label" value="${escHtml(d.label)}" style="width:100%;min-width:130px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
              <td style="padding:4px">
                <select id="fp-doc-${i}-aplica" style="padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px">
                  <option value="vehiculo" ${d.aplicaA==='vehiculo'?'selected':''}>Vehículo</option>
                  <option value="grua" ${d.aplicaA==='grua'?'selected':''}>Grúa</option>
                  <option value="ambos" ${d.aplicaA==='ambos'?'selected':''}>Ambos</option>
                </select>
              </td>
              <td style="padding:4px"><input type="number" id="fp-doc-${i}-margen" value="${d.margenDias||30}" style="width:60px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px"></td>
              <td style="padding:4px"><button class="btn-ghost small" style="color:var(--danger);padding:3px 7px" onclick="quitarDocumentoParam(${i})">✕</button></td>
            </tr>`).join('')}
        </table>
      </div>
      <button class="btn-ghost small" style="margin-top:8px" onclick="agregarDocumentoParam()">➕ Agregar documento</button>
    </div>
    <button class="btn-primary" style="width:100%" onclick="guardarFlotaParametros()">Guardar parámetros</button>`;
}

// Lee los documentos tal como están en el formulario (para no perder ediciones
// al agregar o quitar filas, que obligan a redibujar).
function _leerDocumentosDelForm() {
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  return (p.documentos||[]).map((d,i) => {
    const label = (document.getElementById(`fp-doc-${i}-label`)?.value || d.label || '').trim();
    return {
      // El id se mantiene si ya existía (para no perder las fechas cargadas);
      // si es nuevo, se genera a partir del nombre.
      id: d.id || label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') || ('doc_' + Date.now()),
      label,
      aplicaA: document.getElementById(`fp-doc-${i}-aplica`)?.value || d.aplicaA || 'vehiculo',
      margenDias: parseInt(document.getElementById(`fp-doc-${i}-margen`)?.value) || 30,
    };
  }).filter(d => d.label);
}

function agregarDocumentoParam() {
  const p = _flotaParams || JSON.parse(JSON.stringify(FLOTA_PARAMS_DEFAULT));
  p.documentos = _leerDocumentosDelForm();
  p.documentos.push({ id: '', label: 'Nuevo documento', aplicaA: 'vehiculo', margenDias: 30 });
  _flotaParams = p;
  renderFlotaParametros();
}
window.agregarDocumentoParam = agregarDocumentoParam;

function quitarDocumentoParam(i) {
  const p = _flotaParams || JSON.parse(JSON.stringify(FLOTA_PARAMS_DEFAULT));
  const docs = _leerDocumentosDelForm();
  const doc = docs[i];
  if (doc && !confirm(`¿Quitar "${doc.label}" del control de vencimientos?\n\nLas fechas ya cargadas en las unidades no se borran, pero dejan de controlarse.`)) return;
  docs.splice(i, 1);
  p.documentos = docs;
  _flotaParams = p;
  renderFlotaParametros();
}
window.quitarDocumentoParam = quitarDocumentoParam;

async function guardarFlotaParametros() {
  const num = id => parseFloat(document.getElementById(id)?.value) || 0;
  const p = JSON.parse(JSON.stringify(_flotaParams || FLOTA_PARAMS_DEFAULT));
  Object.keys(p.tiposVehiculo).forEach(k => {
    p.tiposVehiculo[k].anios = num(`fp-${k}-anios`);
    p.tiposVehiculo[k].km = num(`fp-${k}-km`);
    p.tiposVehiculo[k].residualPct = num(`fp-${k}-res`);
    p.tiposVehiculo[k].serviceKm = num(`fp-${k}-svckm`);
    p.tiposVehiculo[k].serviceHoras = num(`fp-${k}-svchs`);
  });
  p.grua.anios = num('fp-grua-anios');
  p.grua.horas = num('fp-grua-horas');
  p.grua.residualPct = num('fp-grua-res');
  p.grua.serviceHoras = num('fp-grua-svchs');
  p.alarmas = { margenKm: num('fp-margen-km'), margenHoras: num('fp-margen-hs') };
  p.combustible = { nafta: num('fp-nafta'), gasoil: num('fp-gasoil'), actualizado: new Date().toISOString() };
  p.documentos = _leerDocumentosDelForm();
  try {
    await fbSaveFlotaParametros(p);
    _flotaParams = p;
    showToast('✓ Parámetros guardados', 'success');
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.guardarFlotaParametros = guardarFlotaParametros;

// ── FIN GESTIÓN DE FLOTA (parte 1) ────────────────────────────

// ── Vehículos ──
let _flotaFiltro = '';

function renderFlotaVehiculos() {
  const cont = document.getElementById('flota-vehiculos-content');
  if (!cont) return;
  // El buscador se dibuja una sola vez y la lista se refresca aparte, para que
  // el input no pierda el foco mientras el técnico escribe.
  cont.innerHTML = `
    <button class="btn-primary" style="width:100%;margin-bottom:8px" onclick="editarVehiculo()">➕ Agregar vehículo</button>
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <button class="btn-ghost small" style="flex:1" onclick="importarDesdeGeotab()">📥 Importar de Geotab</button>
      <button class="btn-ghost small" style="flex:1" onclick="actualizarContadoresGeotab()">🔄 Actualizar km/horas</button>
    </div>
    <div style="position:relative;margin-bottom:10px">
      <input type="search" id="flota-buscar" value="${escHtml(_flotaFiltro)}" oninput="filtrarFlotaVehiculos()"
        placeholder="🔍 Buscar por patente, marca o modelo…"
        style="width:100%;padding:10px 12px;border-radius:9px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">
    </div>
    <div id="flota-vehiculos-lista"></div>`;
  renderFlotaVehiculosLista();
}

function filtrarFlotaVehiculos() {
  _flotaFiltro = document.getElementById('flota-buscar')?.value || '';
  renderFlotaVehiculosLista();
}
window.filtrarFlotaVehiculos = filtrarFlotaVehiculos;

function renderFlotaVehiculosLista() {
  const cont = document.getElementById('flota-vehiculos-lista');
  if (!cont) return;
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  const tipoLabel = t => p.tiposVehiculo[t]?.label || t;

  // Filtrado: patente, marca, modelo o tipo. Ignora mayúsculas y espacios,
  // así "ab123cd" y "AB 123 CD" encuentran lo mismo.
  const q = _flotaFiltro.trim().toLowerCase().replace(/\s+/g, '');
  const filtrados = q
    ? _flotaVehiculos.filter(v => {
        const texto = `${v.patente||''}${v.marca||''}${v.modelo||''}${tipoLabel(v.tipo)||''}`.toLowerCase().replace(/\s+/g, '');
        return texto.includes(q);
      })
    : _flotaVehiculos;

  if (!_flotaVehiculos.length) {
    cont.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">No hay vehículos cargados todavía.</div>';
    return;
  }
  if (!filtrados.length) {
    cont.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Ningún vehículo coincide con "${escHtml(_flotaFiltro)}".</div>`;
    return;
  }

  const contador = q
    ? `<div style="font-size:11px;color:var(--text3);margin-bottom:8px">${filtrados.length} de ${_flotaVehiculos.length} unidades</div>`
    : `<div style="font-size:11px;color:var(--text3);margin-bottom:8px">${_flotaVehiculos.length} unidades</div>`;

  cont.innerHTML = contador + filtrados.map(v => {
    const grua = v.gruaId ? _flotaGruas.find(g => g.fbId === v.gruaId) : null;
    return `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div style="flex:1">
          <div style="font-weight:700;color:var(--text);font-size:15px">${escHtml(v.marca)} ${escHtml(v.modelo)} <span style="font-size:12px;color:var(--accent)">${escHtml(v.patente)}</span></div>
          <div style="font-size:12px;color:var(--text3);margin-top:2px">${escHtml(tipoLabel(v.tipo))} · Año ${escHtml(v.anio||'—')} · ${(v.kmActual||v.kmInicial||0).toLocaleString('es-AR')} km${v.horasMotorActual?` · ${v.horasMotorActual.toLocaleString('es-AR')} hs motor`:''}</div>
          ${v.geotabId?`<div style="font-size:11px;color:var(--accent);margin-top:2px">📡 Geotab${v.geotabActualizado?` · actualizado ${new Date(v.geotabActualizado).toLocaleDateString('es-AR')}`:''}</div>`:''}
          ${grua?`<div style="font-size:11px;color:var(--text3);margin-top:2px">🏗️ ${escHtml(grua.codigo||grua.marca||'Grúa')} asignada</div>`:''}
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-ghost small" onclick="abrirEventoFlota('vehiculo','${v.fbId}')">➕ Evento</button>
          <button class="btn-ghost small" onclick="verEventosFlota('vehiculo','${v.fbId}')">📋 Historial</button>
          <button class="btn-ghost small" onclick="editarVehiculo('${v.fbId}')">✏️</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Grúas ──
function renderFlotaGruas() {
  const cont = document.getElementById('flota-gruas-content');
  if (!cont) return;
  const fuenteLabel = { horometro: 'Horómetro propio', pto: 'PTO del camión', manual: 'Manual' };
  const lista = _flotaGruas.length ? _flotaGruas.map(g => {
    const veh = g.vehiculoId ? _flotaVehiculos.find(v => v.fbId === g.vehiculoId) : null;
    return `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div style="flex:1">
          <div style="font-weight:700;color:var(--text);font-size:15px">${escHtml(g.codigo||'Grúa')} <span style="font-size:12px;color:var(--text3)">${escHtml(g.marca||'')} ${escHtml(g.modelo||'')}</span></div>
          <div style="font-size:12px;color:var(--text3);margin-top:2px">${(g.horasActuales||g.horasIniciales||0).toLocaleString('es-AR')} hs · ${escHtml(fuenteLabel[g.fuenteHoras]||g.fuenteHoras||'—')}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${veh?`🚗 En ${escHtml(veh.patente)}`:'Sin asignar'}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-ghost small" onclick="abrirEventoFlota('grua','${g.fbId}')">➕ Evento</button>
          <button class="btn-ghost small" onclick="verEventosFlota('grua','${g.fbId}')">📋 Historial</button>
          <button class="btn-ghost small" onclick="editarGrua('${g.fbId}')">✏️</button>
        </div>
      </div>
    </div>`;
  }).join('') : '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">No hay hidrogrúas cargadas todavía.</div>';
  cont.innerHTML = `
    <button class="btn-primary" style="width:100%;margin-bottom:14px" onclick="editarGrua()">➕ Agregar hidrogrúa</button>
    ${lista}`;
}

// ── Alarmas de service (placeholder hasta la parte de eventos) ──
// Calcula el estado de service de una unidad.
// Devuelve un array de chequeos (por km y/o por horas, lo que aplique al tipo).
// Estado: 'vencido' | 'proximo' | 'ok'. Se toma el más urgente (lo que ocurra primero).
function calcChequeosService(unidad, esGrua, p) {
  const margenKm = p.alarmas?.margenKm ?? 1000;
  const margenHs = p.alarmas?.margenHoras ?? 100;
  const chequeos = [];

  const push = (unidadLbl, intervalo, base, actual, margen, sinService) => {
    if (!intervalo || intervalo <= 0) return;
    const proximo = base + intervalo;
    const restante = proximo - actual;
    const estado = restante <= 0 ? 'vencido' : (restante <= margen ? 'proximo' : 'ok');
    chequeos.push({ unidad: unidadLbl, proximo, restante, estado, sinService });
  };

  if (esGrua) {
    const intervalo = unidad.proximoServiceHorasEn || p.grua?.serviceHoras || 0;
    const base = unidad.ultimoServiceEn != null ? unidad.ultimoServiceEn : (unidad.horasIniciales || 0);
    push('hs', intervalo, base, unidad.horasActuales || 0, margenHs, unidad.ultimoServiceEn == null);
  } else {
    const t = p.tiposVehiculo?.[unidad.tipo] || {};
    // Por km (siempre)
    const intervaloKm = unidad.proximoServiceEn || t.serviceKm || 0;
    const baseKm = unidad.ultimoServiceEn != null ? unidad.ultimoServiceEn : (unidad.kmInicial || 0);
    push('km', intervaloKm, baseKm, unidad.kmActual || 0, margenKm, unidad.ultimoServiceEn == null);
    // Por horas de motor (solo si el tipo lo controla, ej: unidades con hidrogrúa
    // que acumulan ralentí sin sumar km)
    if ((t.serviceHoras || 0) > 0) {
      const intervaloHs = unidad.proximoServiceHorasEn || t.serviceHoras;
      const baseHs = unidad.ultimoServiceHoras != null ? unidad.ultimoServiceHoras : 0;
      push('hs', intervaloHs, baseHs, unidad.horasMotorActual || 0, margenHs, unidad.ultimoServiceHoras == null);
    }
  }
  return chequeos;
}

// ── Cálculo de costos y amortización ──────────────────────────
// Costo real: sale de los eventos cargados (combustible, peajes, service,
// averías, reparaciones) dividido por el recorrido real desde el alta.
// Amortización HÍBRIDA (años + km/horas, lo que se cumpla primero): si la unidad
// hace pocos km al año, se deprecia antes por antigüedad que por uso, así que se
// proyectan los km que llegará a hacer en su vida útil en años y se amortiza
// sobre ese total (que puede ser menor a la vida útil en km).
function calcCostosUnidad(u, esGrua, p) {
  const evs = _flotaEventos.filter(e => e.refId === u.fbId);
  const t = esGrua ? (p.grua || {}) : (p.tiposVehiculo?.[u.tipo] || {});

  // Recorrido real desde el alta
  const recorrido = esGrua
    ? Math.max(0, (u.horasActuales || 0) - (u.horasIniciales || 0))
    : Math.max(0, (u.kmActual || 0) - (u.kmInicial || 0));

  // Antigüedad
  const aniosTranscurridos = u.fechaAlta
    ? Math.max(0, (Date.now() - new Date(u.fechaAlta + 'T12:00:00').getTime()) / (1000*60*60*24*365.25))
    : 0;

  // Costos reales por rubro
  const porTipo = { combustible: 0, peaje: 0, service: 0, averia: 0, reparacion: 0 };
  let litros = 0;
  evs.forEach(e => {
    const m = parseFloat(e.monto) || 0;
    if (porTipo[e.tipo] !== undefined) porTipo[e.tipo] += m;
    if (e.tipo === 'combustible') litros += parseFloat(e.litros) || 0;
  });
  const totalReal = Object.values(porTipo).reduce((a,b) => a+b, 0);

  // Amortización
  const valorCompra = u.valorCompra || 0;
  const residual = valorCompra * ((t.residualPct || 0) / 100);
  const depreciable = Math.max(0, valorCompra - residual);
  const vidaUtilUso = esGrua ? (t.horas || 0) : (t.km || 0);   // km u horas de vida útil
  const vidaUtilAnios = t.anios || 0;

  // Uso proyectado hasta el fin de la vida útil (criterio híbrido)
  const usoPorAnio = aniosTranscurridos > 0.08 && recorrido > 0 ? recorrido / aniosTranscurridos : 0;
  let usoProyectado = vidaUtilUso;
  if (usoPorAnio > 0 && vidaUtilAnios > 0) {
    usoProyectado = Math.min(vidaUtilUso || Infinity, usoPorAnio * vidaUtilAnios);
  }
  if (!usoProyectado || !isFinite(usoProyectado)) usoProyectado = vidaUtilUso;
  const amortPorUso = usoProyectado > 0 ? depreciable / usoProyectado : 0;

  // Vida útil consumida: el mayor entre uso y antigüedad
  const pctUso = vidaUtilUso > 0 ? (recorrido / vidaUtilUso) * 100 : 0;
  const pctAnios = vidaUtilAnios > 0 ? (aniosTranscurridos / vidaUtilAnios) * 100 : 0;
  const pctVida = Math.min(100, Math.max(pctUso, pctAnios));
  const criterioVida = pctAnios >= pctUso ? 'antigüedad' : (esGrua ? 'horas' : 'km');
  const amortAcumulada = depreciable * (pctVida / 100);
  const valorActual = Math.max(residual, valorCompra - amortAcumulada);

  // Costos fijos acumulados (seguro + patente), solo vehículos
  let fijosAcum = 0;
  if (!esGrua) {
    fijosAcum = (u.seguroMensual || 0) * (aniosTranscurridos * 12) + (u.patenteAnual || 0) * aniosTranscurridos;
  }

  // Por unidad de uso ($/km o $/hora)
  const realPorUso  = recorrido > 0 ? totalReal / recorrido : 0;
  const fijosPorUso = recorrido > 0 ? fijosAcum / recorrido : 0;
  const totalPorUso = realPorUso + amortPorUso + fijosPorUso;

  // Rendimiento real (km/L)
  const rendimiento = (!esGrua && litros > 0 && recorrido > 0) ? recorrido / litros : 0;

  return {
    recorrido, aniosTranscurridos, usoPorAnio, litros, rendimiento,
    porTipo, totalReal, realPorUso,
    valorCompra, residual, depreciable, amortPorUso, amortAcumulada, valorActual,
    pctUso, pctAnios, pctVida, criterioVida, usoProyectado,
    fijosAcum, fijosPorUso, totalPorUso,
    eventos: evs.length,
  };
}

let _flotaFiltroCostos = '';

function filtrarFlotaCostos() {
  _flotaFiltroCostos = document.getElementById('flota-buscar-costos')?.value || '';
  renderFlotaCostos();
  // Devolver el foco al buscador (renderFlotaCostos redibuja todo el panel)
  const inp = document.getElementById('flota-buscar-costos');
  if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
}
window.filtrarFlotaCostos = filtrarFlotaCostos;

function renderFlotaCostos() {
  const cont = document.getElementById('flota-costos-content');
  if (!cont) return;
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  const $ = n => '$' + Math.round(n).toLocaleString('es-AR');
  const $d = n => '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  if (!_flotaVehiculos.length && !_flotaGruas.length) {
    cont.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Cargá vehículos para ver el análisis de costos.</div>';
    return;
  }

  const unidades = [
    ..._flotaVehiculos.map(v => ({ u: v, esGrua: false, nombre: `${v.patente} — ${v.marca} ${v.modelo}`, unidad: 'km' })),
    ..._flotaGruas.map(g => ({ u: g, esGrua: true, nombre: g.codigo || 'Grúa', unidad: 'hora' })),
  ].map(x => ({ ...x, c: calcCostosUnidad(x.u, x.esGrua, p) }))
   // Ordenadas por vida útil consumida: las más cerca de renovación, primero
   .sort((a,b) => b.c.pctVida - a.c.pctVida);

  // Totales de la flota (siempre sobre TODAS las unidades, no sobre el filtro)
  const totalGastado = unidades.reduce((a,x) => a + x.c.totalReal, 0);
  const totalAmort = unidades.reduce((a,x) => a + x.c.amortAcumulada, 0);
  const totalValorActual = unidades.reduce((a,x) => a + x.c.valorActual, 0);

  // Filtro por patente / marca / modelo
  const q = (_flotaFiltroCostos || '').trim().toLowerCase().replace(/\s+/g, '');
  const visibles = q
    ? unidades.filter(x => x.nombre.toLowerCase().replace(/\s+/g, '').includes(q))
    : unidades;

  const barra = (pct, color) =>
    `<div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-top:5px">
       <div style="height:100%;width:${Math.min(100,pct)}%;background:${color}"></div></div>`;

  cont.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase">Gasto real acumulado</div>
        <div style="font-size:17px;font-weight:700;color:var(--accent)">${$(totalGastado)}</div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase">Amortización acum.</div>
        <div style="font-size:17px;font-weight:700">${$(totalAmort)}</div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase">Valor actual flota</div>
        <div style="font-size:17px;font-weight:700">${$(totalValorActual)}</div>
      </div>
    </div>

    <button class="btn-ghost" style="width:100%;margin-bottom:10px" onclick="exportarFlotaSheets()">📊 Exportar a Google Sheets (Flota DND)</button>

    <input type="search" id="flota-buscar-costos" value="${escHtml(_flotaFiltroCostos||'')}" oninput="filtrarFlotaCostos()"
      placeholder="🔍 Buscar por patente, marca o modelo…"
      style="width:100%;padding:10px 12px;border-radius:9px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px;margin-bottom:6px">
    <div style="font-size:11px;color:var(--text3);margin-bottom:10px">
      ${q ? `${visibles.length} de ${unidades.length} unidades` : `${unidades.length} unidades`} · ordenadas por vida útil consumida
    </div>

    ${visibles.map(({u, esGrua, nombre, unidad, c}) => {
      const sinDatos = c.recorrido <= 0;
      const colorVida = c.pctVida >= 85 ? 'var(--danger)' : (c.pctVida >= 60 ? 'var(--warning)' : 'var(--accent)');
      return `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
          <div>
            <div style="font-weight:600;font-size:14px">${esGrua?'🏗️':'🚗'} ${escHtml(nombre)}</div>
            <div style="font-size:11px;color:var(--text3)">
              ${c.recorrido.toLocaleString('es-AR')} ${unidad}${esGrua?'s':''} recorridos · ${c.aniosTranscurridos.toFixed(1)} años
              ${c.usoPorAnio ? ` · ${Math.round(c.usoPorAnio).toLocaleString('es-AR')} ${unidad}/año` : ''}
              ${c.eventos ? ` · ${c.eventos} eventos` : ' · sin eventos'}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--text3);text-transform:uppercase">Costo total</div>
            <div style="font-size:19px;font-weight:700;color:var(--accent)">${sinDatos?'—':$d(c.totalPorUso)}</div>
            <div style="font-size:10px;color:var(--text3)">por ${unidad}</div>
          </div>
        </div>

        ${sinDatos ? `<div style="font-size:11px;color:var(--text3);padding:6px 0">Todavía no hay recorrido registrado. Cargá una lectura de ${esGrua?'horómetro':'odómetro'} para calcular el costo.</div>` : `
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:11px;margin-bottom:10px">
          <div style="background:var(--bg3);border-radius:8px;padding:7px">
            <div style="color:var(--text3)">Combustible</div><div style="font-weight:600">${$d(c.recorrido?c.porTipo.combustible/c.recorrido:0)}</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:7px">
            <div style="color:var(--text3)">Service+rep.</div><div style="font-weight:600">${$d(c.recorrido?(c.porTipo.service+c.porTipo.averia+c.porTipo.reparacion)/c.recorrido:0)}</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:7px">
            <div style="color:var(--text3)">Amortización</div><div style="font-weight:600">${$d(c.amortPorUso)}</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:7px">
            <div style="color:var(--text3)">Fijos</div><div style="font-weight:600">${$d(c.fijosPorUso)}</div>
          </div>
        </div>

        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">
          Vida útil consumida: <strong style="color:${colorVida}">${c.pctVida.toFixed(0)}%</strong> (manda ${c.criterioVida}) ·
          valor actual estimado ${$(c.valorActual)}
          ${c.rendimiento ? ` · rendimiento real ${c.rendimiento.toFixed(1)} km/L` : ''}
        </div>
        ${barra(c.pctVida, colorVida)}
        ${c.pctVida >= 85 ? `<div style="font-size:11px;color:var(--danger);margin-top:6px">⚠️ Cerca del fin de vida útil por ${c.criterioVida} — evaluar renovación</div>` : ''}
        `}
      </div>`;
    }).join('')}

    <div style="font-size:11px;color:var(--text3);margin-top:12px;line-height:1.6">
      El costo real sale de los eventos cargados dividido por el recorrido desde el alta.
      La amortización es híbrida: se proyecta el uso según los km/horas por año reales y la vida útil en años, y se toma lo que se cumpla primero.
    </div>`;
}
window.renderFlotaCostos = renderFlotaCostos;

// ── Exportación a Google Sheets ───────────────────────────────
// Hoja "Flota DND": una fila por unidad con costos y amortización (para el dashboard).
// Hoja "Flota Eventos": una fila por evento (historial de service, averías, cargas).
function buildFlotaExportRows(p) {
  const headers = [
    'Tipo', 'Patente/Código', 'Marca', 'Modelo', 'Año', 'Combustible', 'Grúa asignada', 'Estado',
    'Inicial (km/hs)', 'Actual (km/hs)', 'Recorrido', 'Horas motor', 'Años de uso', 'Uso por año',
    'Valor compra', 'Valor residual', 'Valor actual', 'Amortización acumulada',
    '% Vida útil consumida', 'Criterio', 'Uso proyectado vida útil',
    'Gasto combustible', 'Gasto peajes', 'Gasto service', 'Gasto averías', 'Gasto reparaciones', 'Gasto total',
    'Litros cargados', 'Rendimiento km/L',
    '$/u combustible', '$/u service+reparaciones', '$/u amortización', '$/u fijos', '$/u TOTAL',
    'Último service', 'Eventos registrados', 'Actualizado'
  ];
  // Columnas de vencimiento: una por cada documento configurado
  const docsCols = (p.documentos || []);
  docsCols.forEach(d => headers.push(`Vence ${d.label}`));
  docsCols.forEach(d => headers.push(`Días ${d.label}`));
  const rows = [headers];
  const ahora = new Date().toLocaleString('es-AR');

  const agregar = (u, esGrua) => {
    const c = calcCostosUnidad(u, esGrua, p);
    const t = esGrua ? (p.grua || {}) : (p.tiposVehiculo?.[u.tipo] || {});
    const grua = !esGrua && u.gruaId ? _flotaGruas.find(g => g.fbId === u.gruaId) : null;
    const r2 = n => Math.round(n * 100) / 100;
    const chkDocs = calcChequeosDocumentos(u, esGrua, p);
    const porId = {}; chkDocs.forEach(c2 => { porId[c2.id] = c2; });
    const fila = [
      esGrua ? 'Hidrogrúa' : (t.label || u.tipo || ''),
      esGrua ? (u.codigo || '') : (u.patente || ''),
      u.marca || '', u.modelo || '', esGrua ? '' : (u.anio || ''),
      esGrua ? '' : (u.combustible === 'nafta' ? 'Nafta' : 'Gasoil'),
      grua ? (grua.codigo || '') : '',
      u.estado || 'activo',
      esGrua ? (u.horasIniciales || 0) : (u.kmInicial || 0),
      esGrua ? (u.horasActuales || 0) : (u.kmActual || 0),
      c.recorrido,
      esGrua ? '' : (u.horasMotorActual || 0),
      r2(c.aniosTranscurridos),
      Math.round(c.usoPorAnio),
      c.valorCompra, Math.round(c.residual), Math.round(c.valorActual), Math.round(c.amortAcumulada),
      r2(c.pctVida), c.criterioVida, Math.round(c.usoProyectado),
      Math.round(c.porTipo.combustible), Math.round(c.porTipo.peaje), Math.round(c.porTipo.service),
      Math.round(c.porTipo.averia), Math.round(c.porTipo.reparacion), Math.round(c.totalReal),
      r2(c.litros), c.rendimiento ? r2(c.rendimiento) : '',
      r2(c.recorrido ? c.porTipo.combustible / c.recorrido : 0),
      r2(c.recorrido ? (c.porTipo.service + c.porTipo.averia + c.porTipo.reparacion) / c.recorrido : 0),
      r2(c.amortPorUso), r2(c.fijosPorUso), r2(c.totalPorUso),
      u.ultimoServiceFecha || '', c.eventos, ahora
    ];
    // Fecha de vencimiento y días restantes de cada documento
    docsCols.forEach(d => fila.push(porId[d.id]?.fecha || ''));
    docsCols.forEach(d => fila.push(porId[d.id]?.dias ?? ''));
    rows.push(fila);
  };
  _flotaVehiculos.forEach(v => agregar(v, false));
  _flotaGruas.forEach(g => agregar(g, true));
  return rows;
}

function buildFlotaEventosRows() {
  const headers = [
    'Fecha', 'Unidad', 'Tipo de unidad', 'Marca/Modelo', 'Evento',
    'Monto', 'Litros', 'Precio/litro', 'Km', 'Horas motor',
    'Descripción', 'Próximo service', 'Factura', 'Registrado'
  ];
  const rows = [headers];
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  _flotaEventos.forEach(e => {
    const esGrua = e.tipoRef === 'grua';
    const u = esGrua ? _flotaGruas.find(g => g.fbId === e.refId) : _flotaVehiculos.find(v => v.fbId === e.refId);
    if (!u) return; // unidad dada de baja
    const t = esGrua ? null : (p.tiposVehiculo?.[u.tipo] || {});
    rows.push([
      e.fecha ? new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-AR') : '',
      esGrua ? (u.codigo || '') : (u.patente || ''),
      esGrua ? 'Hidrogrúa' : (t?.label || u.tipo || ''),
      `${u.marca || ''} ${u.modelo || ''}`.trim(),
      (FLOTA_EVENTO_LABELS[e.tipo] || e.tipo).replace(/^[^\s]+\s/, ''), // sin el emoji
      e.monto || 0, e.litros || '', e.precioLitro || '',
      e.km || '', e.horasMotor || e.horas || '',
      e.descripcion || '',
      e.proximoService || e.proximoServiceHoras || '',
      e.fotoUrl || '',
      e.creadoEn ? new Date(e.creadoEn).toLocaleString('es-AR') : ''
    ]);
  });
  return rows;
}

async function exportarFlotaSheets() {
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  try {
    showToast('Conectando con Google Sheets…', '');
    const token = await getGoogleAccessToken();

    const escribir = async (hoja, rows) => {
      // Rango amplio: la hoja Flota DND crece si se agregan tipos de documento
      const clear = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent(hoja + '!A:CZ')}:clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!clear.ok) {
        const err = await clear.json().catch(()=>({}));
        throw new Error(err.error?.message || `HTTP ${clear.status} — ¿existe la hoja "${hoja}"?`);
      }
      const write = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent(hoja + '!A1')}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows })
      });
      if (!write.ok) {
        const err = await write.json().catch(()=>({}));
        throw new Error(err.error?.message || `HTTP ${write.status}`);
      }
    };

    const unidades = buildFlotaExportRows(p);
    await escribir('Flota DND', unidades);

    let msgEventos = '';
    const eventos = buildFlotaEventosRows();
    if (eventos.length > 1) {
      try {
        await escribir('Flota Eventos', eventos);
        msgEventos = ` + ${eventos.length - 1} eventos`;
      } catch(e) {
        console.warn('Flota Eventos:', e.message);
        msgEventos = ` (hoja Flota Eventos: ${e.message})`;
      }
    }
    showToast(`✓ ${unidades.length - 1} unidades${msgEventos} exportadas`, 'success');
  } catch(e) {
    console.error('Export flota:', e);
    showToast('Error al exportar: ' + e.message, 'error');
  }
}
window.exportarFlotaSheets = exportarFlotaSheets;

function renderFlotaAlarmas() {
  const cont = document.getElementById('flota-alarmas-content');
  if (!cont) return;
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;

  const filas = [];
  const alDia = [];
  const sinDatos = [];

  const evaluar = (u, esGrua) => {
    const nombre = esGrua ? (u.codigo || 'Grúa') : `${u.patente} — ${u.marca} ${u.modelo}`;
    const chequeos = calcChequeosService(u, esGrua, p);
    if (!chequeos.length) { sinDatos.push(nombre); return; }
    // El chequeo más urgente manda (menor restante)
    const urgente = chequeos.slice().sort((a,b) => a.restante - b.restante)[0];
    const item = { nombre, esGrua, u, chequeos, urgente };
    if (urgente.estado === 'ok') alDia.push(item); else filas.push(item);
  };
  _flotaVehiculos.forEach(v => evaluar(v, false));
  _flotaGruas.forEach(g => evaluar(g, true));

  // Vencidos primero, después próximos, cada grupo por urgencia
  filas.sort((a,b) => (a.urgente.estado === b.urgente.estado)
    ? a.urgente.restante - b.urgente.restante
    : (a.urgente.estado === 'vencido' ? -1 : 1));

  if (!_flotaVehiculos.length && !_flotaGruas.length) {
    cont.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Cargá vehículos o grúas para ver sus alarmas de service.</div>';
    return;
  }

  const chip = (c) => {
    const color = c.estado === 'vencido' ? 'var(--danger)' : (c.estado === 'proximo' ? 'var(--warning)' : 'var(--accent)');
    const txt = c.estado === 'vencido'
      ? `Vencido por ${Math.abs(Math.round(c.restante)).toLocaleString('es-AR')} ${c.unidad}`
      : `Faltan ${Math.round(c.restante).toLocaleString('es-AR')} ${c.unidad}`;
    return `<span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;border:1px solid ${color};color:${color};margin-right:5px">${txt}${c.sinService?' *':''}</span>`;
  };

  cont.innerHTML = `
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">🔧 Service</div>
    ${filas.length ? filas.map(f => {
      const esVencido = f.urgente.estado === 'vencido';
      const borde = esVencido ? 'var(--danger)' : 'var(--warning)';
      return `<div style="background:var(--bg2);border:1px solid var(--border);border-left:3px solid ${borde};border-radius:10px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <div style="font-weight:600;font-size:14px">${esVencido?'🔴':'🟡'} ${escHtml(f.nombre)}</div>
            <div style="font-size:11px;color:var(--text3);margin:4px 0 6px">
              ${f.esGrua ? `${(f.u.horasActuales||0).toLocaleString('es-AR')} hs` : `${(f.u.kmActual||0).toLocaleString('es-AR')} km${(f.u.horasMotorActual)?` · ${f.u.horasMotorActual.toLocaleString('es-AR')} hs motor`:''}`}
              ${f.u.ultimoServiceFecha?` · último service: ${new Date(f.u.ultimoServiceFecha+'T12:00:00').toLocaleDateString('es-AR')}`:''}
            </div>
            <div>${f.chequeos.map(chip).join('')}</div>
          </div>
          <button class="btn-ghost small" style="white-space:nowrap" onclick="abrirEventoFlota('${f.esGrua?'grua':'vehiculo'}','${f.u.fbId}')">🔧 Registrar</button>
        </div>
      </div>`;
    }).join('') : '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px;text-align:center;color:var(--accent);font-size:13px;margin-bottom:10px">✓ No hay services pendientes</div>'}

    ${alDia.length ? `<div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px">Al día (${alDia.length})</div>
      ${alDia.map(f => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="font-size:13px">🟢 ${escHtml(f.nombre)}</div>
        <div style="font-size:11px;color:var(--text3);text-align:right">${f.chequeos.map(c => `Faltan ${Math.round(c.restante).toLocaleString('es-AR')} ${c.unidad}`).join(' · ')}</div>
      </div>`).join('')}` : ''}

    ${sinDatos.length ? `<div style="font-size:11px;color:var(--text3);margin-top:12px">Sin intervalo de service configurado: ${sinDatos.map(escHtml).join(', ')}. Configuralo en Parámetros.</div>` : ''}

    <div style="font-size:11px;color:var(--text3);margin-top:12px;line-height:1.6">
      Se avisa con ${p.alarmas?.margenKm ?? 1000} km / ${p.alarmas?.margenHoras ?? 100} hs de anticipación (editable en Parámetros).<br>
      Las unidades con hidrogrúa se controlan por km <em>y</em> por horas de motor: manda lo que se cumpla primero.<br>
      <span style="opacity:.7">* Sin service registrado: se cuenta desde el alta de la unidad.</span>
    </div>

    ${renderAlarmasDocumentos(p)}`;
}

// Estado de la documentación de una unidad (VTV, seguro, patente, etc.).
// Se controla por fecha: la anticipación de cada documento se define en Parámetros.
function calcChequeosDocumentos(u, esGrua, p) {
  const aplica = esGrua ? 'grua' : 'vehiculo';
  const docs = (p.documentos || []).filter(d => d.aplicaA === aplica || d.aplicaA === 'ambos');
  const hoy = new Date(); hoy.setHours(12,0,0,0); // mediodía, igual que el ancla del vencimiento: así los días dan exactos
  return docs.map(d => {
    const fecha = u.documentos?.[d.id];
    if (!fecha) return { id: d.id, label: d.label, sinFecha: true, estado: 'sin_dato' };
    const venc = new Date(fecha + 'T12:00:00');
    const dias = Math.round((venc - hoy) / (1000 * 60 * 60 * 24));
    const margen = d.margenDias || 30;
    const estado = dias < 0 ? 'vencido' : (dias <= margen ? 'proximo' : 'ok');
    return { id: d.id, label: d.label, fecha, dias, estado, margen };
  });
}

function renderAlarmasDocumentos(p) {
  if (!(p.documentos || []).length) return '';
  const conAlarma = [];
  let sinCargar = 0, alDia = 0;

  const evaluar = (u, esGrua) => {
    const nombre = esGrua ? (u.codigo || 'Grúa') : `${u.patente} — ${u.marca} ${u.modelo}`;
    const chequeos = calcChequeosDocumentos(u, esGrua, p);
    const alertas = chequeos.filter(c => c.estado === 'vencido' || c.estado === 'proximo');
    sinCargar += chequeos.filter(c => c.estado === 'sin_dato').length;
    alDia += chequeos.filter(c => c.estado === 'ok').length;
    if (alertas.length) {
      const urgente = alertas.slice().sort((a,b) => a.dias - b.dias)[0];
      conAlarma.push({ nombre, esGrua, u, alertas, urgente });
    }
  };
  _flotaVehiculos.forEach(v => evaluar(v, false));
  _flotaGruas.forEach(g => evaluar(g, true));

  conAlarma.sort((a,b) => a.urgente.dias - b.urgente.dias);

  const chip = (c) => {
    const color = c.estado === 'vencido' ? 'var(--danger)' : 'var(--warning)';
    const txt = c.estado === 'vencido'
      ? `${escHtml(c.label)}: vencido hace ${Math.abs(c.dias)} días`
      : `${escHtml(c.label)}: vence en ${c.dias} días`;
    return `<span style="display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;border:1px solid ${color};color:${color};margin:0 5px 4px 0">${txt}</span>`;
  };

  return `
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px">📄 Documentación</div>
    ${conAlarma.length ? conAlarma.map(f => {
      const esVencido = f.urgente.estado === 'vencido';
      const borde = esVencido ? 'var(--danger)' : 'var(--warning)';
      return `<div style="background:var(--bg2);border:1px solid var(--border);border-left:3px solid ${borde};border-radius:10px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${esVencido?'🔴':'🟡'} ${escHtml(f.nombre)}</div>
            <div style="margin-top:6px">${f.alertas.map(chip).join('')}</div>
          </div>
          <button class="btn-ghost small" style="white-space:nowrap" onclick="${f.esGrua?'editarGrua':'editarVehiculo'}('${f.u.fbId}')">✏️ Actualizar</button>
        </div>
      </div>`;
    }).join('') : '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px;text-align:center;color:var(--accent);font-size:13px">✓ No hay documentación por vencer</div>'}
    <div style="font-size:11px;color:var(--text3);margin-top:8px">
      ${alDia} documento${alDia===1?'':'s'} al día${sinCargar?` · ${sinCargar} sin fecha cargada (no se controlan)`:''}.
      Los tipos de documento y su anticipación se configuran en Parámetros.
    </div>`;
}

// ══════════════════════════════════════════════════════════════
// ── INTEGRACIÓN GEOTAB ────────────────────────────────────────
// La flota está monitoreada por Geotab. El Worker scancheck-geotab-proxy
// expone los vehículos con su odómetro y horas de motor actuales (las
// credenciales de Geotab viven en el Worker, nunca en el cliente).
// Se usa para dos cosas:
//   1. Importar las unidades (evita cargar 67 vehículos a mano)
//   2. Actualizar los contadores (km y horas) sin carga manual
// El vínculo entre una unidad de Geotab y un vehículo de la app es geotabId.
// ══════════════════════════════════════════════════════════════
const GEOTAB_PROXY_URL = 'https://scancheck-geotab-proxy.elopapa.workers.dev';
let _geotabUnidades = [];

// Sugiere el tipo de vehículo a partir del texto de la ficha de Geotab.
// Es solo una ayuda para no elegir 67 veces a mano: el admin puede cambiarlo.
function sugerirTipoVehiculo(texto) {
  const t = (texto || '').toLowerCase();
  if (/1938|atego|accelo|camion|camión/.test(t)) return 'camion_grua';
  if (/daily|iveco/.test(t)) return 'camion_grua';
  if (/hilux|amarok|ranger|s10|frontier|toyota/.test(t)) return 'camioneta_grua';
  if (/sprinter|master|ducato|boxer|furgon|furgón/.test(t)) return 'furgon';
  if (/kangoo|partner|berlingo|fiorino|combo/.test(t)) return 'utilitario';
  if (/kwid|onix|argo|cronos|gol|corolla|etios/.test(t)) return 'auto';
  return 'utilitario';
}

async function importarDesdeGeotab() {
  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `<div style="font-size:16px;font-weight:700;margin-bottom:10px">Importar desde Geotab</div>
    <div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Consultando Geotab…<br><span style="font-size:11px">Puede tardar unos segundos con toda la flota.</span></div>`;
  openModalFlota();

  try {
    const res = await fetch(`${GEOTAB_PROXY_URL}/vehiculos?dias=30`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Respuesta inesperada de Geotab');
    _geotabUnidades = data.unidades || [];

    // Separar las que ya están en la app (por geotabId o patente)
    const yaCargadas = new Set();
    _flotaVehiculos.forEach(v => {
      if (v.geotabId) yaCargadas.add(v.geotabId);
      if (v.patente) yaCargadas.add(v.patente.toUpperCase().trim());
    });
    const nuevas = _geotabUnidades.filter(u => !yaCargadas.has(u.deviceId) && !yaCargadas.has(u.patente));
    const existentes = _geotabUnidades.length - nuevas.length;

    const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
    const tiposOpts = (sel) => Object.entries(p.tiposVehiculo)
      .map(([k,t]) => `<option value="${k}" ${sel===k?'selected':''}>${escHtml(t.label)}</option>`).join('');

    cont.innerHTML = `
      <div style="font-size:16px;font-weight:700;margin-bottom:4px">Importar desde Geotab</div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:12px">
        ${data.total} unidades en Geotab · ${data.conDatos} con contador · ${existentes} ya cargadas
      </div>

      ${nuevas.length === 0 ? `
        <div style="text-align:center;padding:20px;color:var(--accent);font-size:13px">✓ Todas las unidades de Geotab ya están cargadas.</div>
      ` : `
        <div style="font-size:12px;color:var(--text3);margin-bottom:8px">
          Se importan patente, VIN, odómetro y horas de motor. El tipo viene sugerido según la ficha de Geotab — revisalo.
          Después completá valor de compra y costos fijos editando cada unidad.
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <button class="btn-ghost small" onclick="geotabMarcarTodas(true)">Seleccionar todas</button>
          <button class="btn-ghost small" onclick="geotabMarcarTodas(false)">Ninguna</button>
        </div>
        <div style="max-height:46vh;overflow-y:auto;border:1px solid var(--border);border-radius:10px;padding:6px">
          ${nuevas.map((u,i) => `
            <div style="display:flex;gap:8px;align-items:flex-start;padding:8px 4px;border-bottom:1px solid var(--border)">
              <input type="checkbox" class="gt-check" id="gt-ck-${i}" checked style="margin-top:3px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px">${escHtml(u.patente || u.nombre || '(sin patente)')}</div>
                <div style="font-size:11px;color:var(--text3);overflow:hidden;text-overflow:ellipsis">
                  ${u.comentario ? escHtml(u.comentario.slice(0,60)) : (u.vin ? 'VIN ' + escHtml(u.vin) : '—')}
                </div>
                <div style="font-size:11px;color:var(--text3)">
                  ${u.odometroKm != null ? `${u.odometroKm.toLocaleString('es-AR')} km` : '<span style="color:var(--warning)">sin odómetro</span>'}
                  ${u.horasMotor != null ? ` · ${u.horasMotor.toLocaleString('es-AR')} hs motor` : ''}
                </div>
                <select id="gt-tipo-${i}" style="width:100%;margin-top:4px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px">
                  ${tiposOpts(sugerirTipoVehiculo((u.comentario||'') + ' ' + (u.nombre||'')))}
                </select>
              </div>
            </div>`).join('')}
        </div>
      `}

      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn-ghost" style="flex:1" onclick="closeModal('modal-flota')">Cerrar</button>
        ${nuevas.length ? `<button class="btn-primary" style="flex:2" onclick="confirmarImportGeotab()">Importar seleccionadas</button>` : ''}
      </div>`;

    window._geotabNuevas = nuevas;
  } catch(e) {
    cont.innerHTML = `<div style="font-size:16px;font-weight:700;margin-bottom:10px">Importar desde Geotab</div>
      <div style="color:var(--danger);font-size:13px;padding:12px 0">Error: ${escHtml(e.message)}</div>
      <div style="font-size:11px;color:var(--text3);line-height:1.6">
        Verificá que el Worker <strong>scancheck-geotab-proxy</strong> esté publicado y que tenga cargadas las variables
        GEOTAB_DATABASE, GEOTAB_USER y GEOTAB_PASSWORD.
      </div>
      <button class="btn-ghost" style="width:100%;margin-top:12px" onclick="closeModal('modal-flota')">Cerrar</button>`;
  }
}
window.importarDesdeGeotab = importarDesdeGeotab;

function geotabMarcarTodas(valor) {
  document.querySelectorAll('.gt-check').forEach(c => { c.checked = valor; });
}
window.geotabMarcarTodas = geotabMarcarTodas;

async function confirmarImportGeotab() {
  const nuevas = window._geotabNuevas || [];
  const aImportar = [];
  nuevas.forEach((u,i) => {
    if (document.getElementById('gt-ck-'+i)?.checked) {
      aImportar.push({ u, tipo: document.getElementById('gt-tipo-'+i)?.value || 'utilitario' });
    }
  });
  if (!aImportar.length) { showToast('No seleccionaste ninguna unidad', 'error'); return; }

  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text3)">Importando 0/${aImportar.length}…</div>`;
  let ok = 0;
  for (const { u, tipo } of aImportar) {
    try {
      // Marca/modelo: se intenta separar del comentario de la ficha de Geotab
      const partes = (u.comentario || '').split(/\s+/).filter(Boolean);
      const marca = partes[1] || '';   // el comentario suele arrancar con la patente
      const modelo = partes.slice(2, 5).join(' ') || '';
      await fbSaveFlotaVehiculo({
        geotabId: u.deviceId,
        tipo,
        marca, modelo, anio: '',
        patente: u.patente || u.nombre || '',
        vin: u.vin || '',
        kmInicial: u.odometroKm ?? 0,
        kmActual: u.odometroKm ?? 0,
        horasMotorActual: u.horasMotor ?? 0,
        valorCompra: 0,
        fechaAlta: localDateKey(),
        seguroMensual: 0, patenteAnual: 0,
        combustible: 'gasoil',
        gruaId: null,
        estado: 'activo',
      });
      ok++;
      cont.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text3)">Importando ${ok}/${aImportar.length}…</div>`;
    } catch(e) { console.warn('Import', u.patente, e.message); }
  }
  showToast(`✓ ${ok} unidades importadas`, 'success');
  closeModal('modal-flota');
  await cargarFlota();
}
window.confirmarImportGeotab = confirmarImportGeotab;

// Actualiza km y horas de motor de las unidades vinculadas a Geotab.
async function actualizarContadoresGeotab() {
  const vinculados = _flotaVehiculos.filter(v => v.geotabId);
  if (!vinculados.length) { showToast('No hay vehículos vinculados a Geotab. Usá "Importar de Geotab".', 'error'); return; }
  showToast('Consultando Geotab…', '');
  try {
    const res = await fetch(`${GEOTAB_PROXY_URL}/vehiculos?dias=30`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Respuesta inesperada');
    const porId = {};
    (data.unidades || []).forEach(u => { porId[u.deviceId] = u; });

    let actualizados = 0, sinDatos = 0;
    for (const v of vinculados) {
      const u = porId[v.geotabId];
      if (!u || u.odometroKm == null) { sinDatos++; continue; }
      const patch = {};
      // Solo avanzar el contador (nunca retroceder por una lectura vieja)
      if (u.odometroKm > (v.kmActual || 0)) patch.kmActual = u.odometroKm;
      if (u.horasMotor != null && u.horasMotor > (v.horasMotorActual || 0)) patch.horasMotorActual = u.horasMotor;
      if (Object.keys(patch).length) {
        patch.geotabActualizado = new Date().toISOString();
        await fbSaveFlotaVehiculo({ fbId: v.fbId, ...patch });
        actualizados++;
      }
    }
    showToast(`✓ ${actualizados} unidades actualizadas${sinDatos?` · ${sinDatos} sin datos recientes`:''}`, 'success');
    await cargarFlota();
  } catch(e) {
    showToast('Error: ' + e.message, 'error');
  }
}
window.actualizarContadoresGeotab = actualizarContadoresGeotab;
// ── FIN INTEGRACIÓN GEOTAB ────────────────────────────────────

// ── Alta / edición de vehículo ──
// Campos de vencimiento de documentación, según los tipos definidos en Parámetros.
function _docsHtml(p, aplicaA, valores) {
  const docs = (p.documentos || []).filter(d => d.aplicaA === aplicaA || d.aplicaA === 'ambos');
  if (!docs.length) return '';
  return `<div style="border-top:1px solid var(--border);margin-top:12px;padding-top:10px">
    <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Vencimientos</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${docs.map(d => `
        <div style="margin-bottom:6px">
          <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${escHtml(d.label)}</label>
          <input type="date" id="fdoc-${d.id}" value="${escHtml(valores[d.id] || '')}"
            style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:12px">
        </div>`).join('')}
    </div>
  </div>`;
}

// Lee las fechas de vencimiento del formulario abierto.
function _leerDocs(p, aplicaA) {
  const docs = (p.documentos || []).filter(d => d.aplicaA === aplicaA || d.aplicaA === 'ambos');
  const out = {};
  docs.forEach(d => {
    const val = document.getElementById(`fdoc-${d.id}`)?.value;
    if (val) out[d.id] = val;
  });
  return out;
}

function editarVehiculo(fbId) {
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  const v = fbId ? _flotaVehiculos.find(x => x.fbId === fbId) : {};
  const esNuevo = !fbId;
  const tiposOpts = Object.entries(p.tiposVehiculo).map(([k,t]) =>
    `<option value="${k}" ${v.tipo===k?'selected':''}>${escHtml(t.label)}</option>`).join('');
  // Grúas disponibles: sin asignar, o la que ya tiene este vehículo
  const gruasOpts = ['<option value="">— Ninguna —</option>'].concat(
    _flotaGruas.filter(g => !g.vehiculoId || g.vehiculoId === fbId)
      .map(g => `<option value="${g.fbId}" ${v.gruaId===g.fbId?'selected':''}>${escHtml(g.codigo||g.marca||'Grúa')}</option>`)
  ).join('');

  const inp = (id, label, val='', type='text', ph='') =>
    `<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${label}</label>
     <input type="${type}" id="${id}" value="${val!=null?String(val).replace(/"/g,'&quot;'):''}" placeholder="${ph}" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>`;

  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `
    <div style="font-size:16px;font-weight:700;margin-bottom:14px">${esNuevo?'Agregar':'Editar'} vehículo</div>
    <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Tipo de vehículo *</label>
      <select id="fv-tipo" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">${tiposOpts}</select></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${inp('fv-marca','Marca *', v.marca)}
      ${inp('fv-modelo','Modelo *', v.modelo)}
      ${inp('fv-patente','Patente *', v.patente, 'text', 'AB123CD')}
      ${inp('fv-anio','Año', v.anio, 'number', '2023')}
      ${inp('fv-km-inicial','Km inicial', v.kmInicial, 'number')}
      ${inp('fv-km-actual','Km actual', v.kmActual ?? v.kmInicial, 'number')}
      ${inp('fv-horas-motor','Horas de motor', v.horasMotorActual, 'number', 'Solo si el service es por hs')}
      ${inp('fv-valor','Valor de compra $', v.valorCompra, 'number')}
      ${inp('fv-fecha-alta','Fecha de alta', v.fechaAlta || localDateKey(), 'date')}
      ${inp('fv-seguro','Seguro $/mes', v.seguroMensual, 'number')}
      ${inp('fv-patente-costo','Patente $/año', v.patenteAnual, 'number')}
    </div>
    <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Combustible *</label>
      <select id="fv-combustible" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">
        <option value="nafta" ${v.combustible==='nafta'?'selected':''}>Nafta</option>
        <option value="gasoil" ${v.combustible==='gasoil'||!v.combustible?'selected':''}>Gasoil / Diésel</option>
      </select></div>
    <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Hidrogrúa asignada</label>
      <select id="fv-grua" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">${gruasOpts}</select></div>

    ${_docsHtml(p, 'vehiculo', v.documentos || {})}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-ghost" style="flex:1" onclick="closeModal('modal-flota')">Cancelar</button>
      ${!esNuevo?`<button class="btn-ghost" style="color:var(--danger)" onclick="borrarVehiculo('${fbId}')">🗑️</button>`:''}
      <button class="btn-primary" style="flex:2" onclick="guardarVehiculo('${fbId||''}')">Guardar</button>
    </div>`;
  openModalFlota();
}
window.editarVehiculo = editarVehiculo;

// Helper para abrir el modal de flota (mismo patrón que el resto de la app)
function openModalFlota() { document.getElementById('modal-flota').classList.remove('hidden'); }

async function guardarVehiculo(fbId) {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const num = id => { const n = parseFloat(val(id)); return isNaN(n) ? 0 : n; };
  const patente = val('fv-patente').toUpperCase();
  if (!val('fv-marca') || !val('fv-modelo') || !patente) {
    showToast('Completá marca, modelo y patente', 'error'); return;
  }
  const gruaId = val('fv-grua') || null;
  const vehiculo = {
    tipo: val('fv-tipo'),
    combustible: val('fv-combustible') || 'gasoil',
    marca: val('fv-marca'), modelo: val('fv-modelo'), patente,
    anio: val('fv-anio'),
    kmInicial: num('fv-km-inicial'), kmActual: num('fv-km-actual') || num('fv-km-inicial'),
    horasMotorActual: num('fv-horas-motor'),
    valorCompra: num('fv-valor'),
    fechaAlta: val('fv-fecha-alta'),
    seguroMensual: num('fv-seguro'), patenteAnual: num('fv-patente-costo'),
    gruaId,
    estado: 'activo',
    documentos: _leerDocs(_flotaParams || FLOTA_PARAMS_DEFAULT, 'vehiculo'),
  };
  if (fbId) vehiculo.fbId = fbId;
  try {
    const savedId = await fbSaveFlotaVehiculo(vehiculo);
    // Sincronizar la asignación de la grúa (relación bidireccional + historial)
    await _sincronizarAsignacionGrua(savedId, gruaId, fbId);
    showToast('✓ Vehículo guardado', 'success');
    closeModal('modal-flota');
    await cargarFlota();
  } catch(e) {
    showToast('Error al guardar: ' + e.message, 'error');
  }
}
window.guardarVehiculo = guardarVehiculo;

// Mantiene la relación vehículo↔grúa consistente y registra el historial de
// asignaciones en la grúa (para conservarlo al reinstalarla en otro chasis).
async function _sincronizarAsignacionGrua(vehiculoId, nuevaGruaId, vehiculoIdPrevio) {
  // Grúa que tenía antes este vehículo (si cambió)
  const gruaPrevia = _flotaGruas.find(g => g.vehiculoId === vehiculoIdPrevio);
  if (gruaPrevia && gruaPrevia.fbId !== nuevaGruaId) {
    await fbSaveFlotaGrua({ fbId: gruaPrevia.fbId, vehiculoId: null });
  }
  // Asignar la nueva grúa a este vehículo
  if (nuevaGruaId) {
    const grua = _flotaGruas.find(g => g.fbId === nuevaGruaId);
    const historial = (grua?.historialAsignaciones || []).slice();
    if (!grua?.vehiculoId || grua.vehiculoId !== vehiculoId) {
      historial.push({ vehiculoId, desde: new Date().toISOString() });
    }
    await fbSaveFlotaGrua({ fbId: nuevaGruaId, vehiculoId, historialAsignaciones: historial });
  }
}

async function borrarVehiculo(fbId) {
  if (!confirm('¿Dar de baja este vehículo? Se puede restaurar desde la base de datos.')) return;
  try {
    await fbDeleteFlotaVehiculo(fbId);
    // Liberar la grúa asignada
    const grua = _flotaGruas.find(g => g.vehiculoId === fbId);
    if (grua) await fbSaveFlotaGrua({ fbId: grua.fbId, vehiculoId: null });
    showToast('Vehículo dado de baja', 'success');
    closeModal('modal-flota');
    await cargarFlota();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.borrarVehiculo = borrarVehiculo;
// ── Alta / edición de hidrogrúa ──
function editarGrua(fbId) {
  const g = fbId ? _flotaGruas.find(x => x.fbId === fbId) : {};
  const esNuevo = !fbId;
  const fuenteOpts = [
    ['horometro','Horómetro propio (bomba con motor naftero)'],
    ['pto','PTO del camión (sin horómetro propio)'],
    ['manual','Manual / estimado'],
  ].map(([k,l]) => `<option value="${k}" ${g.fuenteHoras===k?'selected':''}>${l}</option>`).join('');
  // Vehículos disponibles para asignar
  const vehOpts = ['<option value="">— Sin asignar —</option>'].concat(
    _flotaVehiculos.map(v => `<option value="${v.fbId}" ${g.vehiculoId===v.fbId?'selected':''}>${escHtml(v.patente)} (${escHtml(v.marca)} ${escHtml(v.modelo)})</option>`)
  ).join('');

  const inp = (id, label, val='', type='text', ph='') =>
    `<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${label}</label>
     <input type="${type}" id="${id}" value="${val!=null?String(val).replace(/"/g,'&quot;'):''}" placeholder="${ph}" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>`;

  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `
    <div style="font-size:16px;font-weight:700;margin-bottom:14px">${esNuevo?'Agregar':'Editar'} hidrogrúa</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${inp('fg-codigo','Código / Nombre *', g.codigo, 'text', 'Grúa 01')}
      ${inp('fg-capacidad','Capacidad', g.capacidad, 'text', 'Ej: 3 tn')}
      ${inp('fg-marca','Marca', g.marca)}
      ${inp('fg-modelo','Modelo', g.modelo)}
      ${inp('fg-horas-inicial','Horas iniciales', g.horasIniciales, 'number')}
      ${inp('fg-horas-actual','Horas actuales', g.horasActuales ?? g.horasIniciales, 'number')}
      ${inp('fg-valor','Valor de compra $', g.valorCompra, 'number')}
      ${inp('fg-fecha-alta','Fecha de alta', g.fechaAlta || localDateKey(), 'date')}
    </div>
    <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Fuente de horas de uso *</label>
      <select id="fg-fuente" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">${fuenteOpts}</select></div>
    <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Vehículo asignado</label>
      <select id="fg-vehiculo" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px">${vehOpts}</select></div>

    ${_docsHtml(_flotaParams || FLOTA_PARAMS_DEFAULT, 'grua', g.documentos || {})}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-ghost" style="flex:1" onclick="closeModal('modal-flota')">Cancelar</button>
      ${!esNuevo?`<button class="btn-ghost" style="color:var(--danger)" onclick="borrarGrua('${fbId}')">🗑️</button>`:''}
      <button class="btn-primary" style="flex:2" onclick="guardarGrua('${fbId||''}')">Guardar</button>
    </div>`;
  openModalFlota();
}
window.editarGrua = editarGrua;

async function guardarGrua(fbId) {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const num = id => { const n = parseFloat(val(id)); return isNaN(n) ? 0 : n; };
  if (!val('fg-codigo')) { showToast('Ingresá el código/nombre de la grúa', 'error'); return; }
  const nuevoVehiculoId = val('fg-vehiculo') || null;
  const gruaPrevia = fbId ? _flotaGruas.find(g => g.fbId === fbId) : null;

  const grua = {
    codigo: val('fg-codigo'), capacidad: val('fg-capacidad'),
    marca: val('fg-marca'), modelo: val('fg-modelo'),
    horasIniciales: num('fg-horas-inicial'), horasActuales: num('fg-horas-actual') || num('fg-horas-inicial'),
    valorCompra: num('fg-valor'), fechaAlta: val('fg-fecha-alta'),
    fuenteHoras: val('fg-fuente'),
    vehiculoId: nuevoVehiculoId,
    documentos: _leerDocs(_flotaParams || FLOTA_PARAMS_DEFAULT, 'grua'),
  };
  // Historial de asignaciones: si cambió el vehículo, registrarlo
  const historial = (gruaPrevia?.historialAsignaciones || []).slice();
  if (nuevoVehiculoId && gruaPrevia?.vehiculoId !== nuevoVehiculoId) {
    historial.push({ vehiculoId: nuevoVehiculoId, desde: new Date().toISOString() });
  }
  grua.historialAsignaciones = historial;
  if (fbId) grua.fbId = fbId;

  try {
    const savedId = await fbSaveFlotaGrua(grua);
    // Mantener la relación desde el lado del vehículo (gruaId)
    // Liberar el vehículo anterior si cambió
    if (gruaPrevia?.vehiculoId && gruaPrevia.vehiculoId !== nuevoVehiculoId) {
      const vPrev = _flotaVehiculos.find(v => v.fbId === gruaPrevia.vehiculoId);
      if (vPrev) await fbSaveFlotaVehiculo({ fbId: vPrev.fbId, gruaId: null });
    }
    // Asignar al nuevo vehículo
    if (nuevoVehiculoId) {
      await fbSaveFlotaVehiculo({ fbId: nuevoVehiculoId, gruaId: savedId });
    }
    showToast('✓ Hidrogrúa guardada', 'success');
    closeModal('modal-flota');
    await cargarFlota();
  } catch(e) {
    showToast('Error al guardar: ' + e.message, 'error');
  }
}
window.guardarGrua = guardarGrua;

async function borrarGrua(fbId) {
  if (!confirm('¿Dar de baja esta hidrogrúa?')) return;
  try {
    const grua = _flotaGruas.find(g => g.fbId === fbId);
    if (grua?.vehiculoId) {
      const v = _flotaVehiculos.find(x => x.fbId === grua.vehiculoId);
      if (v) await fbSaveFlotaVehiculo({ fbId: v.fbId, gruaId: null });
    }
    await fbDeleteFlotaGrua(fbId);
    showToast('Hidrogrúa dada de baja', 'success');
    closeModal('modal-flota');
    await cargarFlota();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.borrarGrua = borrarGrua;
// ── Carga de eventos (combustible, peaje, service, avería, lectura) ──
let _flotaEventoFoto = null; // dataUrl de la foto de factura (opcional)

function abrirEventoFlota(tipoRef, refId) {
  _flotaEventoFoto = null;
  const esGrua = tipoRef === 'grua';
  const ref = esGrua ? _flotaGruas.find(g => g.fbId === refId) : _flotaVehiculos.find(v => v.fbId === refId);
  if (!ref) { showToast('No se encontró el equipo', 'error'); return; }
  const nombre = esGrua ? (ref.codigo || 'Grúa') : `${ref.patente} (${ref.marca} ${ref.modelo})`;
  const unidadContador = esGrua ? 'Horas' : 'Km';
  const contadorActual = esGrua ? (ref.horasActuales ?? ref.horasIniciales ?? 0) : (ref.kmActual ?? ref.kmInicial ?? 0);

  // Tipos de evento según sea vehículo o grúa
  const tiposEvento = esGrua
    ? [['service','🔧 Service'],['averia','⚠️ Avería'],['reparacion','🛠️ Reparación'],['lectura','📊 Lectura de horómetro']]
    : [['combustible','⛽ Combustible'],['peaje','🛣️ Peaje'],['service','🔧 Service'],['averia','⚠️ Avería'],['reparacion','🛠️ Reparación'],['lectura','📊 Lectura de odómetro']];
  const tipoBtns = tiposEvento.map(([k,l],i) =>
    `<button class="op-btn ${i===0?'active':''}" id="fe-tipo-${k}" onclick="flotaEventoSetTipo('${k}')">${l}</button>`).join('');

  const inp = (id, label, type='text', ph='') =>
    `<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${label}</label>
     <input type="${type}" id="${id}" placeholder="${ph}" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>`;

  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `
    <div style="font-size:16px;font-weight:700;margin-bottom:4px">Nuevo evento</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:14px">${escHtml(nombre)} · ${contadorActual.toLocaleString('es-AR')} ${unidadContador.toLowerCase()}</div>

    <div class="op-type-row" style="flex-wrap:wrap;margin-bottom:12px">${tipoBtns}</div>

    ${inp('fe-fecha','Fecha *','date')}
    <div id="fe-campos"></div>

    <div style="margin:12px 0">
      <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:6px">Foto de factura (opcional)</label>
      <div id="fe-foto-preview"></div>
      <button class="btn-ghost small" onclick="document.getElementById('fe-foto-input').click()">📷 Adjuntar factura</button>
      <input type="file" id="fe-foto-input" accept="image/*" class="hidden" onchange="flotaEventoFoto(event)">
    </div>

    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-ghost" style="flex:1" onclick="closeModal('modal-flota')">Cancelar</button>
      <button class="btn-primary" style="flex:2" onclick="guardarEventoFlota('${tipoRef}','${refId}')">Guardar evento</button>
    </div>`;
  // Fecha por defecto: hoy
  document.getElementById('fe-fecha').value = localDateKey();
  window._flotaEventoTipo = tiposEvento[0][0];
  window._flotaEventoEsGrua = esGrua;
  // Precio de combustible configurado según el tipo del vehículo (para autocompletar)
  const p = _flotaParams || FLOTA_PARAMS_DEFAULT;
  const tipoComb = esGrua ? null : (ref.combustible || 'gasoil');
  window._flotaEventoPrecioComb = tipoComb ? (p.combustible?.[tipoComb] || 0) : 0;
  window._flotaEventoTipoComb = tipoComb;
  // ¿Este vehículo evalúa service también por horas de motor? (unidades con grúa)
  window._flotaEventoUsaHoras = !esGrua && ((p.tiposVehiculo[ref.tipo]?.serviceHoras || 0) > 0);
  flotaEventoSetTipo(tiposEvento[0][0]);
  openModalFlota();
}
window.abrirEventoFlota = abrirEventoFlota;

function flotaEventoSetTipo(tipo) {
  window._flotaEventoTipo = tipo;
  document.querySelectorAll('#modal-flota-content .op-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('fe-tipo-' + tipo);
  if (btn) btn.classList.add('active');

  const esGrua = window._flotaEventoEsGrua;
  const unidad = esGrua ? 'horas' : 'km';
  const campos = document.getElementById('fe-campos');
  const inp = (id, label, type='text', ph='') =>
    `<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${label}</label>
     <input type="${type}" id="${id}" placeholder="${ph}" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>`;
  const lecturaCampo = inp('fe-lectura', `Lectura de ${unidad} (odómetro/horómetro)`, 'number', `Ej: ${esGrua?'1200':'85000'}`);
  // Vehículos con criterio por horas (unidades con hidrogrúa): campo extra de horas de motor
  const usaHoras = window._flotaEventoUsaHoras;
  const horasMotorCampo = usaHoras ? inp('fe-horas-motor','Horas de motor','number','Ej: 1250') : '';

  let html = '';
  if (tipo === 'combustible') {
    const precioConf = window._flotaEventoPrecioComb || 0;
    const tipoComb = window._flotaEventoTipoComb || 'gasoil';
    const labelComb = tipoComb === 'nafta' ? 'Nafta' : 'Gasoil';
    html = `
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Combustible del vehículo: <strong style="color:var(--accent)">${labelComb}</strong>${precioConf?` · precio configurado $${precioConf}/L`:' · sin precio configurado en Parámetros'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${inp('fe-litros','Litros cargados *','number','Ej: 45')}
        <div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">Precio $/litro *</label>
          <input type="number" id="fe-precio-litro" value="${precioConf||''}" placeholder="Ej: 2119" style="width:100%;padding:9px 11px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>
      </div>
      ${inp('fe-monto','Monto total $ (si no, se calcula)','number')}
      ${lecturaCampo}
      ${inp('fe-desc','Estación / observaciones','text')}`;
  } else if (tipo === 'peaje') {
    html = `${inp('fe-monto','Monto $ *','number')}${inp('fe-desc','Descripción (ruta/peaje)','text')}${lecturaCampo}`;
  } else if (tipo === 'service') {
    html = `
      ${inp('fe-monto','Costo del service $ *','number')}
      ${lecturaCampo}
      ${horasMotorCampo}
      ${inp('fe-desc','Trabajos realizados *','text')}
      ${inp('fe-proximo', `Próximo service: cada cuántos ${unidad} (opcional)`, 'number', 'Vacío = usa el intervalo del tipo')}
      ${usaHoras ? inp('fe-proximo-hs','Próximo service: cada cuántas horas de motor (opcional)','number','Vacío = usa el intervalo del tipo') : ''}`;
  } else if (tipo === 'averia' || tipo === 'reparacion') {
    html = `${inp('fe-monto','Costo $','number')}${lecturaCampo}${horasMotorCampo}${inp('fe-desc','Descripción de la ' + (tipo==='averia'?'avería':'reparación') + ' *','text')}`;
  } else if (tipo === 'lectura') {
    html = lecturaCampo + horasMotorCampo;
  }
  campos.innerHTML = html;
}
window.flotaEventoSetTipo = flotaEventoSetTipo;

function flotaEventoFoto(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _flotaEventoFoto = e.target.result;
    document.getElementById('fe-foto-preview').innerHTML =
      `<img src="${_flotaEventoFoto}" style="max-width:120px;border-radius:8px;margin-bottom:6px;display:block">`;
  };
  reader.readAsDataURL(file);
}
window.flotaEventoFoto = flotaEventoFoto;

async function guardarEventoFlota(tipoRef, refId) {
  const val = id => (document.getElementById(id)?.value || '').trim();
  const num = id => { const n = parseFloat(val(id)); return isNaN(n) ? 0 : n; };
  const tipo = window._flotaEventoTipo;
  const esGrua = window._flotaEventoEsGrua;
  const fecha = val('fe-fecha');
  if (!fecha) { showToast('Ingresá la fecha', 'error'); return; }

  // Validaciones por tipo
  if (tipo === 'combustible' && (!num('fe-litros') || !num('fe-precio-litro'))) {
    showToast('Completá litros y precio por litro', 'error'); return;
  }
  if (tipo === 'peaje' && !num('fe-monto')) { showToast('Ingresá el monto del peaje', 'error'); return; }
  if (tipo === 'service' && (!num('fe-monto') || !val('fe-desc'))) { showToast('Completá costo y trabajos del service', 'error'); return; }
  if ((tipo === 'averia' || tipo === 'reparacion') && !val('fe-desc')) { showToast('Describí la ' + (tipo==='averia'?'avería':'reparación'), 'error'); return; }
  if (tipo === 'lectura' && !num('fe-lectura')) { showToast('Ingresá la lectura', 'error'); return; }

  // Monto de combustible: usar el ingresado o calcular litros × precio
  let monto = num('fe-monto');
  if (tipo === 'combustible' && !monto) monto = num('fe-litros') * num('fe-precio-litro');

  const evento = {
    tipoRef, refId,
    tipo, fecha,
    monto,
    descripcion: val('fe-desc'),
    creadoPor: currentUser.id,
    creadoEn: new Date().toISOString(),
  };
  // Lectura de km/horas
  const lectura = num('fe-lectura');
  if (lectura) evento[esGrua ? 'horas' : 'km'] = lectura;
  // Horas de motor (vehículos con criterio por horas)
  const horasMotor = num('fe-horas-motor');
  if (horasMotor) evento.horasMotor = horasMotor;
  // Campos de combustible
  if (tipo === 'combustible') {
    evento.litros = num('fe-litros');
    evento.precioLitro = num('fe-precio-litro');
  }
  // Próximo service
  if (tipo === 'service') {
    if (num('fe-proximo')) evento.proximoService = num('fe-proximo');
    if (num('fe-proximo-hs')) evento.proximoServiceHoras = num('fe-proximo-hs');
  }

  try {
    const fbId = await fbSaveFlotaEvento(evento);
    // Subir foto de factura a R2 si hay
    if (_flotaEventoFoto) {
      try {
        const urls = await uploadPhotosToR2('flota_' + fbId, [_flotaEventoFoto]);
        if (urls.length) await fbSaveFlotaEvento({ fbId, fotoUrl: urls[0] });
      } catch(e) { console.warn('R2 evento flota:', e.message); }
    }
    // Actualizar el contador (km/horas) del equipo si la lectura es mayor
    if (lectura) {
      if (esGrua) {
        const g = _flotaGruas.find(x => x.fbId === refId);
        if (g && lectura > (g.horasActuales || 0)) await fbSaveFlotaGrua({ fbId: refId, horasActuales: lectura });
      } else {
        const v = _flotaVehiculos.find(x => x.fbId === refId);
        if (v && lectura > (v.kmActual || 0)) await fbSaveFlotaVehiculo({ fbId: refId, kmActual: lectura });
      }
    }
    // Actualizar horas de motor del vehículo (unidades con grúa)
    if (horasMotor && !esGrua) {
      const v = _flotaVehiculos.find(x => x.fbId === refId);
      if (v && horasMotor > (v.horasMotorActual || 0)) await fbSaveFlotaVehiculo({ fbId: refId, horasMotorActual: horasMotor });
    }
    // Registrar el último service para las alarmas
    if (tipo === 'service') {
      const patch = { ultimoServiceFecha: fecha };
      if (lectura) patch.ultimoServiceEn = lectura;
      if (num('fe-proximo')) patch.proximoServiceEn = num('fe-proximo');
      if (horasMotor) patch.ultimoServiceHoras = horasMotor;
      if (num('fe-proximo-hs')) patch.proximoServiceHorasEn = num('fe-proximo-hs');
      if (esGrua) await fbSaveFlotaGrua({ fbId: refId, ...patch });
      else await fbSaveFlotaVehiculo({ fbId: refId, ...patch });
    }
    showToast('✓ Evento registrado', 'success');
    closeModal('modal-flota');
    await cargarFlota();
  } catch(e) {
    showToast('Error al guardar: ' + e.message, 'error');
  }
}
window.guardarEventoFlota = guardarEventoFlota;

// ── Historial de eventos de una unidad ──
const FLOTA_EVENTO_LABELS = {
  combustible: '⛽ Combustible', peaje: '🛣️ Peaje', service: '🔧 Service',
  averia: '⚠️ Avería', reparacion: '🛠️ Reparación', lectura: '📊 Lectura'
};

async function verEventosFlota(tipoRef, refId) {
  const esGrua = tipoRef === 'grua';
  const ref = esGrua ? _flotaGruas.find(g => g.fbId === refId) : _flotaVehiculos.find(v => v.fbId === refId);
  if (!ref) { showToast('No se encontró el equipo', 'error'); return; }
  const nombre = esGrua ? (ref.codigo || 'Grúa') : `${ref.patente} (${ref.marca} ${ref.modelo})`;
  const unidad = esGrua ? 'hs' : 'km';

  const cont = document.getElementById('modal-flota-content');
  cont.innerHTML = `<div style="font-size:16px;font-weight:700;margin-bottom:4px">Historial de eventos</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:14px">${escHtml(nombre)}</div>
    <div id="fe-hist-list" style="text-align:center;color:var(--text3);padding:20px">Cargando…</div>
    <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="closeModal('modal-flota')">Cerrar</button>`;
  openModalFlota();

  try {
    const eventos = await fbGetFlotaEventos({ tipoRef, refId });
    const lista = document.getElementById('fe-hist-list');
    if (!eventos.length) {
      lista.innerHTML = '<div style="color:var(--text3);padding:20px">No hay eventos registrados todavía.</div>';
      return;
    }
    // Resumen de costos por tipo
    const totalPorTipo = {};
    let totalGeneral = 0;
    eventos.forEach(e => {
      const m = parseFloat(e.monto) || 0;
      totalPorTipo[e.tipo] = (totalPorTipo[e.tipo] || 0) + m;
      totalGeneral += m;
    });
    const resumen = Object.entries(totalPorTipo)
      .map(([t,m]) => `${FLOTA_EVENTO_LABELS[t]||t}: $${m.toLocaleString('es-AR')}`)
      .join(' · ');

    lista.style.textAlign = 'left';
    lista.innerHTML = `
      <div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:12px">
        <div style="color:var(--text3);margin-bottom:4px">Total registrado: <strong style="color:var(--accent);font-size:14px">$${totalGeneral.toLocaleString('es-AR')}</strong></div>
        <div style="color:var(--text3)">${resumen}</div>
      </div>
      ${eventos.map(e => {
        const fechaF = e.fecha ? new Date(e.fecha+'T12:00:00').toLocaleDateString('es-AR') : '';
        const lect = e.km != null ? `${e.km.toLocaleString('es-AR')} km` : (e.horas != null ? `${e.horas.toLocaleString('es-AR')} hs` : '');
        const monto = e.monto ? `$${parseFloat(e.monto).toLocaleString('es-AR')}` : '';
        const detalleComb = e.tipo==='combustible' && e.litros ? ` · ${e.litros} L × $${e.precioLitro}` : '';
        return `<div style="border-bottom:1px solid var(--border);padding:9px 0;font-size:13px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div>
              <strong>${FLOTA_EVENTO_LABELS[e.tipo]||e.tipo}</strong> <span style="color:var(--text3)">${fechaF}</span>
              ${e.descripcion?`<div style="color:var(--text2);font-size:12px">${escHtml(e.descripcion)}</div>`:''}
              <div style="color:var(--text3);font-size:11px">${lect}${detalleComb}${e.proximoService?` · próx. service: ${e.proximoService.toLocaleString('es-AR')} ${unidad}`:''}</div>
            </div>
            <div style="text-align:right;white-space:nowrap">
              <div style="font-weight:600">${monto}</div>
              ${e.fotoUrl?`<a href="${e.fotoUrl}" target="_blank" style="font-size:11px;color:var(--accent)">📄 factura</a>`:''}
              <button class="btn-ghost small" style="color:var(--danger);padding:2px 6px;margin-top:2px" onclick="borrarEventoFlota('${e.fbId}','${tipoRef}','${refId}')">🗑️</button>
            </div>
          </div>
        </div>`;
      }).join('')}`;
  } catch(e) {
    document.getElementById('fe-hist-list').innerHTML = `<div style="color:var(--danger);padding:20px">Error al cargar: ${e.message}</div>`;
  }
}
window.verEventosFlota = verEventosFlota;

async function borrarEventoFlota(fbId, tipoRef, refId) {
  if (!confirm('¿Borrar este evento?')) return;
  try {
    await fbDeleteFlotaEvento(fbId);
    showToast('Evento borrado', 'success');
    verEventosFlota(tipoRef, refId); // recargar el historial
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.borrarEventoFlota = borrarEventoFlota;
window.abrirEventoFlota = abrirEventoFlota;

// ── GENERADOR DE ETIQUETAS QR (supervisor) ────────────────────
// Genera el QR de identificación de un equipo (tótem/tablet) para
// imprimir como etiqueta adhesiva. Usa api.qrserver.com (requiere conexión).
function showGeneradorEtiqueta() {
  if (document.getElementById('modal-etiqueta-qr')) return;
  const modal = document.createElement('div');
  modal.id = 'modal-etiqueta-qr';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto';
  modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:20px;max-width:400px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4);max-height:92vh;overflow-y:auto">
    <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:12px;text-align:center">🏷️ Generar etiqueta QR</div>
    <div class="op-type-row" style="margin-bottom:14px">
      <button class="op-btn active" id="et-tipo-totem" onclick="etSetTipo('totem')">🗼 Tótem</button>
      <button class="op-btn" id="et-tipo-tablet" onclick="etSetTipo('tablet')">📱 Tablet</button>
    </div>
    <div id="et-campos-totem">${_etCamposTotemHtml()}</div>
    <div id="et-campos-tablet" style="display:none">${_etCamposTabletHtml()}</div>
    <div id="et-qr-result" style="display:none;text-align:center;margin:12px 0">
      <img id="et-qr-img" style="width:220px;height:220px;border-radius:8px;background:#fff;padding:8px">
      <div style="font-size:11px;color:var(--text3);margin-top:6px">Mantené presionada la imagen para guardarla, o tocá Descargar</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="document.getElementById('modal-etiqueta-qr').remove()" style="flex:1;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px;font-weight:600;cursor:pointer">Cerrar</button>
      <button onclick="generarEtiquetaQR()" style="flex:1;padding:11px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:13px;font-weight:700;cursor:pointer">Generar QR</button>
      <button id="et-btn-descargar" onclick="descargarEtiquetaQR()" style="flex:1;padding:11px;border-radius:10px;border:none;background:var(--accent2);color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:none">⬇ Descargar</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  window._etTipo = 'totem';
}
window.showGeneradorEtiqueta = showGeneradorEtiqueta;

const _etInp = (id, label, ph='') => `<div style="margin-bottom:8px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">${label}</label><input type="text" id="${id}" placeholder="${ph}" maxlength="80" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px"></div>`;

function _etCamposTotemHtml() {
  return `${_etInp('et-puesto','N° de Puesto','Ej: 3')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${_etInp('et-serie-minipc','Serie miniPC *')}
      ${_etInp('et-modelo-minipc','Modelo miniPC')}
      ${_etInp('et-ip-minipc','IP miniPC','Ej: 192.168.1.50')}
      ${_etInp('et-mac-minipc','MAC miniPC','Ej: AA:BB:CC:DD:EE:FF')}
      ${_etInp('et-serie-camara','Serie Cámara')}
      ${_etInp('et-modelo-camara','Modelo/Marca Cámara')}
      ${_etInp('et-serie-pantalla','Serie Pantalla')}
      ${_etInp('et-modelo-pantalla','Modelo/Marca Pantalla')}
      ${_etInp('et-inv-dnd','N° Inv. DND')}
      ${_etInp('et-inv-dnm','N° Inv. DNM')}
    </div>`;
}

function _etCamposTabletHtml() {
  return `${_etInp('et-tb-puesto','N° de Puesto','Ej: 3')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${_etInp('et-tb-serie','N° Serie Tablet *')}
      ${_etInp('et-tb-device-id','Device ID')}
      ${_etInp('et-tb-ip','IP','Ej: 192.168.1.60')}
      ${_etInp('et-tb-mac','MAC Add','Ej: AA:BB:CC:DD:EE:FF')}
    </div>`;
}

function etSetTipo(tipo) {
  window._etTipo = tipo;
  document.getElementById('et-tipo-totem').classList.toggle('active', tipo === 'totem');
  document.getElementById('et-tipo-tablet').classList.toggle('active', tipo === 'tablet');
  document.getElementById('et-campos-totem').style.display = tipo === 'totem' ? 'block' : 'none';
  document.getElementById('et-campos-tablet').style.display = tipo === 'tablet' ? 'block' : 'none';
  document.getElementById('et-qr-result').style.display = 'none';
  document.getElementById('et-btn-descargar').style.display = 'none';
}
window.etSetTipo = etSetTipo;

function generarEtiquetaQR() {
  const v = id => (document.getElementById(id)?.value || '').trim();
  const tipo = window._etTipo || 'totem';
  let data, nombreArchivo;

  if (tipo === 'totem') {
    if (!v('et-serie-minipc')) { showToast('Ingresá al menos la serie de la miniPC','error'); return; }
    data = {
      t: 'totem',
      puesto: v('et-puesto'),
      serieMiniPC: v('et-serie-minipc'), modeloMiniPC: v('et-modelo-minipc'),
      ipMiniPC: v('et-ip-minipc'), macMiniPC: v('et-mac-minipc'),
      serieCamara: v('et-serie-camara'), modeloCamara: v('et-modelo-camara'),
      seriePantalla: v('et-serie-pantalla'), modeloPantalla: v('et-modelo-pantalla'),
      invDnd: v('et-inv-dnd'), invDnm: v('et-inv-dnm'),
    };
    nombreArchivo = `Etiqueta_Totem_${(data.serieMiniPC||'').replace(/[^\w-]/g,'_')}.png`;
  } else {
    if (!v('et-tb-serie')) { showToast('Ingresá al menos la serie de la tablet','error'); return; }
    data = {
      t: 'tablet',
      puesto: v('et-tb-puesto'),
      serie: v('et-tb-serie'), deviceId: v('et-tb-device-id'),
      ip: v('et-tb-ip'), mac: v('et-tb-mac'),
    };
    nombreArchivo = `Etiqueta_Tablet_${(data.serie||'').replace(/[^\w-]/g,'_')}.png`;
  }

  // Quitar claves vacías para un QR más chico (más fácil de imprimir/escanear)
  Object.keys(data).forEach(k => { if (!data[k]) delete data[k]; });
  const json = JSON.stringify(data);
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=M&data=' + encodeURIComponent(json);
  const img = document.getElementById('et-qr-img');
  img.src = url;
  document.getElementById('et-qr-result').style.display = 'block';
  document.getElementById('et-btn-descargar').style.display = 'block';
  window._etQrUrl = url;
  window._etQrNombre = nombreArchivo;
}
window.generarEtiquetaQR = generarEtiquetaQR;

async function descargarEtiquetaQR() {
  try {
    const res = await fetch(window._etQrUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = window._etQrNombre || 'etiqueta_totem.png'; a.click();
    URL.revokeObjectURL(url);
  } catch(e) { showToast('Error al descargar: ' + e.message, 'error'); }
}
window.descargarEtiquetaQR = descargarEtiquetaQR;

// ── FIN MÓDULO TÓTEM ──────────────────────────────────────────


// ── VIAJES ───────────────────────────────────────────────────
async function loadViajes() {
  try {
    const todos = await fbGetMyViajes(currentUser.id);
    localViajes = todos.filter(v => !v.eliminado);
    viajeAbierto = localViajes.find(v => v.estado === 'abierto') || null;
    // Si Firestore no tiene viaje abierto pero sí hay uno en localStorage restaurarlo
    if (!viajeAbierto) {
      try {
        const stored = localStorage.getItem('scancheck_viaje_abierto_'+currentUser.id);
        if (stored) {
          const v = JSON.parse(stored);
          const age = Date.now() - new Date(v.fechaSalida).getTime();
          if (age < 7*24*60*60*1000) viajeAbierto = v;
          else localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id);
        }
      } catch(e) {}
    }
    // Persistir viajes programados en localStorage para acceso offline
    _pvPersistirLocal();
  } catch(e) {
    localViajes = [];
    // Si Firestore falla, intentar con localStorage
    try {
      const stored = localStorage.getItem('scancheck_viaje_abierto_'+currentUser.id);
      if (stored) viajeAbierto = JSON.parse(stored);
    } catch(e2) {}
    // Restaurar viajes programados desde localStorage
    try {
      const stored = localStorage.getItem('scancheck_viajes_programados_'+currentUser.id);
      if (stored) {
        const programados = JSON.parse(stored);
        localViajes = [...localViajes, ...programados];
      }
    } catch(e2) {}
  }
  renderViajes();
  renderViajesProgramados();
  renderServiceReports();
  renderViajeAbiertoBanner();
}

// Persiste los viajes programados en localStorage para disponibilidad offline
function _pvPersistirLocal() {
  try {
    // Solo guardamos activos (programado + en curso) — completados viven en Firestore
    const activos = localViajes.filter(v =>
      v.tipo === 'programacion' && !v.eliminado && v.estado !== 'completado'
    );
    localStorage.setItem('scancheck_viajes_programados_'+currentUser.id, JSON.stringify(activos));
  } catch(e) {}
}

function renderViajeAbiertoBanner() {
  const el = document.getElementById('viaje-abierto-banner');
  if (!el) return;
  if (!viajeAbierto) { el.innerHTML = ''; return; }
  const km = viajeAbierto.kmSalida;
  const fecha = new Date(viajeAbierto.fechaSalida).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
  el.innerHTML = `<div style="background:rgba(0,212,170,.12);border:1px solid rgba(0,212,170,.3);border-radius:12px;padding:12px 16px;margin-bottom:16px">
    <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:4px">🚗 Viaje en curso</div>
    <div style="font-size:13px;color:var(--text)">Salida: ${fecha} · ${km.toLocaleString()} km</div>
    ${viajeAbierto.destinoLabel?`<div style="font-size:12px;color:var(--text2)">Destino: ${escHtml(viajeAbierto.destinoLabel)}</div>`:''}
    <button class="btn-primary" style="width:100%;margin-top:10px" onclick="showCerrarViaje()">🏁 Registrar llegada</button>
  </div>`;
}

function renderViajes() {
  const el = document.getElementById('viajes-list');
  if (!el) return;
  const cerrados = localViajes.filter(v => v.estado === 'cerrado' && !v.serviceReportId);
  if (cerrados.length === 0) { el.innerHTML = '<div class="empty-state"><p>Sin viajes cerrados</p></div>'; return; }
  // Agrupar por mes
  const byMes = {};
  cerrados.forEach(v => {
    const mes = v.fechaSalida?.substring(0,7) || '—';
    if (!byMes[mes]) byMes[mes] = [];
    byMes[mes].push(v);
  });
  el.innerHTML = Object.keys(byMes).sort((a,b)=>b.localeCompare(a)).map(mes => {
    const label = new Date(mes+'-15').toLocaleDateString('es-AR',{month:'long',year:'numeric'});
    const totalKm = byMes[mes].reduce((s,v)=>s+(v.kmRecorridos||0),0);
    const items = byMes[mes].map(v => {
      const fechaSal = new Date(v.fechaSalida).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
      const fechaLleg = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border);position:relative"><button onclick="eliminarViaje('${v.fbId}')" title="Eliminar viaje" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:rgba(238,85,51,.5);font-size:16px;cursor:pointer;padding:2px;line-height:1">🗑</button>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.destinoLabel||'Sin destino especificado')}</div>
            <div style="font-size:11px;color:var(--text3)">Salida: ${fechaSal} · Llegada: ${fechaLleg}</div>
            <div style="font-size:11px;color:var(--text3)">Od. salida: ${v.kmSalida?.toLocaleString()} km → Od. llegada: ${v.kmLlegada?.toLocaleString()||'—'} km</div>
            ${v.distanciaGPS?`<div style="font-size:11px;color:var(--text3)">Distancia GPS estimada: ~${v.distanciaGPS} km</div>`:''}
          </div>
          <div style="text-align:right;flex-shrink:0;padding-left:12px">
            <div style="font-size:22px;font-weight:700;color:var(--accent)">${(v.kmRecorridos||0).toLocaleString()}</div>
            <div style="font-size:10px;color:var(--text3)">km</div>
          </div>

        </div>

      </div>`;
    }).join('');
    return `<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 0 4px">${label} — Total: ${totalKm.toLocaleString()} km</div>${items}`;
  }).join('');
}

// Muestra el formulario de inicio de viaje, con destino precargado si se indica
function _mostrarFormIniciarViaje(destinoPrecargado = '') {
  // Si se llama sin destino precargado, limpiar el viaje vinculado
  if (!destinoPrecargado) window._pvViajeVinculadoId = null;
  const el = document.getElementById('modal-viaje-content');
  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🚗 Iniciar viaje</div>
    <div class="form-group">
      <label>Km odómetro de SALIDA *</label>
      <input type="number" id="inp-km-salida" placeholder="Ej: 125430" min="0" style="font-size:18px;font-weight:700">
    </div>
    <div class="form-group">
      <label>Destino / descripción del viaje</label>
      <input type="text" id="inp-viaje-destino" placeholder="Ej: Jama, Clorinda, Paso de los Libres..." maxlength="100" onblur="checkEstadoPasoDestino()" value="${escHtml(destinoPrecargado)}">
      <div id="estado-paso-destino" style="display:none;margin-top:6px;padding:8px 12px;border-radius:8px;font-size:12px"></div>
    </div>
    <div class="form-group">
      <label>Vehículo (patente)</label>
      <input type="text" id="inp-viaje-vehiculo" placeholder="Ej: AB 123 CD" maxlength="20" value="${currentUser?.vehiculo||''}">
    </div>
    <div class="form-group">
      <label>Foto del odómetro de salida <span style="color:var(--text3);font-size:11px">(recomendado)</span></label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="inp-foto-odometro-salida" accept="image/*" capture="environment" style="display:none" onchange="previewFotoOdometro(this,'preview-odo-salida')">
        <button type="button" onclick="document.getElementById('inp-foto-odometro-salida').click()"
          style="padding:8px 14px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer">
          📷 Sacar foto
        </button>
        <img id="preview-odo-salida" style="display:none;width:60px;height:45px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-viaje')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="guardarInicioViaje()">Iniciar viaje</button>
    </div>`;
  document.getElementById('modal-viaje').classList.remove('hidden');
  // Si hay destino precargado, disparar el chequeo del paso
  if (destinoPrecargado) setTimeout(() => checkEstadoPasoDestino(), 300);
}
window._mostrarFormIniciarViaje = _mostrarFormIniciarViaje;

function showIniciarViaje() {
  if (viajeAbierto) { showToast('Ya tenés un viaje en curso — registrá la llegada primero','error'); return; }

  // Buscar viajes programados activos para hoy
  const hoy = localDateKey();
  const programadosHoy = localViajes.filter(v =>
    v.tipo === 'programacion' && !v.eliminado &&
    (v.estado === 'programado' || v.estado === 'en curso') &&
    v.fechaInicio && v.fechaInicio <= hoy && v.fechaFin && v.fechaFin >= hoy
  );

  if (programadosHoy.length === 0) {
    // No hay viaje programado para hoy — abrir formulario directo
    _mostrarFormIniciarViaje();
    return;
  }

  // Hay uno o más viajes programados activos hoy — mostrar selector
  _mostrarSelectorViajesProgramados(programadosHoy);
}

// Muestra popup para que el técnico elija si vincula un viaje programado al tramo
function _mostrarSelectorViajesProgramados(programados) {
  const el = document.getElementById('modal-viaje-content');
  const fmtF = iso => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}) : '—';

  const items = programados.map((v, i) => {
    const paradas = (v.paradas||[]).map(p=>p.ciudad).filter(Boolean).join(' → ') || '—';
    const estado = v.estado === 'en curso' ? '<span style="color:#f59e0b;font-size:10px;font-weight:600">● EN CURSO</span>' : '<span style="color:#3b82f6;font-size:10px;font-weight:600">● PROGRAMADO</span>';
    return `<div style="background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.proyecto||'Sin proyecto')}</div>
        ${estado}
      </div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:2px">📅 ${fmtF(v.fechaInicio)} – ${fmtF(v.fechaFin)}</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">📍 ${escHtml(paradas)}</div>
      <button onclick="_pvIniciarDesdeSelector('${v.fbId||v.id}')"
        style="width:100%;padding:9px;border-radius:8px;border:none;background:var(--accent);color:#0a1628;font-size:13px;font-weight:700;cursor:pointer">
        🚀 Iniciar este viaje
      </button>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px">🗓️ Viaje programado activo</div>
    <div style="font-size:13px;color:var(--text2);margin-bottom:16px">Tenés ${programados.length === 1 ? 'un viaje programado' : programados.length + ' viajes programados'} para hoy. ¿Querés iniciar alguno?</div>
    ${items}
    <button onclick="_mostrarFormIniciarViaje()" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;margin-top:4px">
      Iniciar viaje sin vincular a programación
    </button>
    <button onclick="closeModal('modal-viaje')" style="width:100%;padding:10px;border-radius:10px;border:none;background:transparent;color:var(--text3);font-size:13px;cursor:pointer;margin-top:4px">
      Cancelar
    </button>`;
  document.getElementById('modal-viaje').classList.remove('hidden');
}
window._mostrarSelectorViajesProgramados = _mostrarSelectorViajesProgramados;

// El técnico elige iniciar un viaje programado específico.
// NO cambia el estado aquí — el cambio ocurre solo cuando confirma el inicio del viaje.
// Guardamos el fbId del viaje vinculado para usarlo en guardarInicioViaje().
function _pvIniciarDesdeSelector(id) {
  const viaje = localViajes.find(v => (v.fbId === id || v.id === id));
  if (!viaje) { _mostrarFormIniciarViaje(); return; }

  // Guardar referencia al viaje programado vinculado (sin cambiar estado todavía)
  window._pvViajeVinculadoId = id;

  // Precargar destino con la primera parada del itinerario
  const primeraParada = (viaje.paradas||[]).find(p => p.ciudad?.trim());
  const destino = primeraParada
    ? primeraParada.ciudad + (primeraParada.provincia ? ', ' + primeraParada.provincia : '')
    : viaje.proyecto || '';

  _mostrarFormIniciarViaje(destino);
}
window._pvIniciarDesdeSelector = _pvIniciarDesdeSelector;

// Iniciado desde el botón 🚀 en la lista de viajes programados:
// cambia estado + abre directamente el formulario de inicio de viaje
async function _pvIniciarDesdeListado(id) {
  if (viajeAbierto) { showToast('Ya tenés un viaje en curso — registrá la llegada primero','error'); return; }
  await _pvIniciarDesdeSelector(id);
}
window._pvIniciarDesdeListado = _pvIniciarDesdeListado;

async function guardarInicioViaje() {
  const kmSalida = parseInt(document.getElementById('inp-km-salida')?.value);
  if (!kmSalida || kmSalida <= 0) { showToast('Ingresá el km del odómetro','error'); return; }
  const destino = document.getElementById('inp-viaje-destino')?.value.trim() || '';
  const vehiculo = document.getElementById('inp-viaje-vehiculo')?.value.trim() || '';

  // Mostrar spinner mientras se procesa
  const btnIniciar = document.getElementById('modal-viaje-content')?.querySelector('.btn-primary');
  if (btnIniciar) { btnIniciar.disabled = true; btnIniciar.innerHTML = '⏳ Iniciando...'; }
  // Subir foto del odómetro de salida a R2 si la adjuntaron
  let fotoOdometroSalidaUrl = null;
  let fotoOdometroSalidaDataUrl = null;
  const fotoInput = document.getElementById('inp-foto-odometro-salida');
  if (fotoInput?.files?.[0]) {
    try {
      const tempId = 'vj_'+Date.now();
      const reader = new FileReader();
      fotoOdometroSalidaDataUrl = await new Promise(res => { reader.onload = e => res(e.target.result); reader.readAsDataURL(fotoInput.files[0]); });
      if (navigator.onLine) {
        const blob = await (await fetch(fotoOdometroSalidaDataUrl)).blob();
        const uploadRes = await fetch(`${PHOTOS_PROXY_URL}/upload/${tempId}/odometro_salida.jpg`, {
          method: 'PUT', headers: { 'Content-Type': 'image/jpeg', 'X-ScanCheck-Token': PHOTOS_TOKEN }, body: blob
        });
        if (uploadRes.ok) fotoOdometroSalidaUrl = (await uploadRes.json()).url;
      }
      // Guardar dataUrl en localStorage para subir después si no hay conexión
      if (!fotoOdometroSalidaUrl) {
        try { localStorage.setItem('scancheck_foto_odo_salida_pendiente', JSON.stringify({dataUrl: fotoOdometroSalidaDataUrl, tempId})); } catch(e) {}
      }
    } catch(e) { console.warn('Error subiendo foto odómetro salida:', e.message); }
  }

  // Capturar GPS de salida
  let latSalida = null, lonSalida = null;
  try {
    if (navigator.geolocation) {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000})
      );
      latSalida = pos.coords.latitude;
      lonSalida = pos.coords.longitude;
    }
  } catch(e) { console.warn('GPS salida no disponible:', e.message); }

  const viaje = {
    id: 'vj_'+Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    vehiculo,
    fechaSalida: new Date().toISOString(),
    kmSalida,
    destinoLabel: destino,
    latSalida,
    lonSalida,
    fechaLlegada: null,
    kmLlegada: null,
    latLlegada: null,
    lonLlegada: null,
    kmRecorridos: null,
    distanciaGPS: null,
    fotoOdometroSalida: fotoOdometroSalidaUrl,
    estado: 'abierto',
    createdAt: new Date().toISOString()
  };
  localViajes.unshift(viaje);
  viajeAbierto = viaje;
  try { localStorage.setItem('scancheck_viaje_abierto_'+currentUser.id, JSON.stringify(viaje)); } catch(e) {}

  // Si hay un viaje programado vinculado, cambiar su estado a "en curso" ahora
  // (el técnico confirmó el inicio del tramo, recién ahora actualizamos)
  if (window._pvViajeVinculadoId) {
    pvCambiarEstado(window._pvViajeVinculadoId, 'en curso').catch(e => console.warn('Error actualizando estado viaje programado:', e));
    window._pvViajeVinculadoId = null;
  }

  closeModal('modal-viaje');
  renderViajeAbiertoBanner();
  renderViajes();
  renderViajesProgramados();

  if (navigator.onLine) {
    try {
      const fbId = await fbSaveViaje(viaje);
      viaje.fbId = fbId;
      localViajes[0].fbId = fbId;
      // Actualizar localStorage con fbId
      try { localStorage.setItem('scancheck_viaje_abierto_'+currentUser.id, JSON.stringify(viaje)); } catch(e) {}
      showToast('✓ Viaje iniciado','success');
    } catch(e) {
      queueAdd('viaje', viaje);
      showToast('✓ Viaje iniciado (se sincronizará al recuperar conexión)','success');
    }
  } else {
    queueAdd('viaje', viaje);
    showToast('✓ Viaje iniciado sin conexión — se sincronizará automáticamente','success');
  }
}

function showCerrarViaje() {
  if (!viajeAbierto) return;
  const el = document.getElementById('modal-viaje-content');
  const kmSalida = viajeAbierto.kmSalida;
  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🏁 Registrar llegada</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:var(--text2)">
      Km odómetro de salida: <strong>${kmSalida?.toLocaleString()} km</strong>
    </div>
    <div class="form-group">
      <label>Km odómetro de LLEGADA *</label>
      <input type="number" id="inp-km-llegada" placeholder="Ej: 126150" min="${kmSalida+1}" style="font-size:18px;font-weight:700">
    </div>
    <div id="km-diff-preview" style="text-align:center;font-size:28px;font-weight:700;color:var(--accent);margin:8px 0;display:none"></div>
    <div class="form-group" style="margin-top:8px">
      <label>Foto del odómetro de llegada <span style="color:var(--text3);font-size:11px">(recomendado)</span></label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="inp-foto-odometro-llegada" accept="image/*" capture="environment" style="display:none" onchange="previewFotoOdometro(this,'preview-odo-llegada')">
        <button type="button" onclick="document.getElementById('inp-foto-odometro-llegada').click()"
          style="padding:8px 14px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer">
          📷 Sacar foto
        </button>
        <img id="preview-odo-llegada" style="display:none;width:60px;height:45px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-viaje')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="guardarCierreViaje()">Guardar llegada</button>
    </div>`;
  document.getElementById('inp-km-llegada').addEventListener('input', function() {
    const diff = parseInt(this.value) - kmSalida;
    const preview = document.getElementById('km-diff-preview');
    if (diff > 0) { preview.textContent = diff.toLocaleString()+' km recorridos'; preview.style.display='block'; }
    else { preview.style.display='none'; }
  });
  document.getElementById('modal-viaje').classList.remove('hidden');
}

async function guardarCierreViaje() {
  const kmLlegada = parseInt(document.getElementById('inp-km-llegada')?.value);
  if (!kmLlegada || kmLlegada <= viajeAbierto.kmSalida) { showToast('El km de llegada debe ser mayor al de salida','error'); return; }

  // Mostrar spinner mientras se procesa
  const btnCerrar = document.getElementById('modal-viaje-content')?.querySelector('.btn-primary');
  if (btnCerrar) { btnCerrar.disabled = true; btnCerrar.innerHTML = '⏳ Guardando...'; }
  const kmRecorridos = kmLlegada - viajeAbierto.kmSalida;
  // Calcular distancia GPS estimada usando los registros del día
  const hoy = localScans.filter(s => localDateKey(s.timestamp) === localDateKey(viajeAbierto.fechaSalida) && s.userId === currentUser.id);
  let distanciaGPS = null;
  if (hoy.length >= 2) {
    let total = 0;
    for (let i = 1; i < hoy.length; i++) {
      const a = hoy[i-1], b = hoy[i];
      if (a.lat && b.lat) {
        const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLon = (b.lon-a.lon)*Math.PI/180;
        const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
        total += R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
      }
    }
    distanciaGPS = Math.round(total);
  }
  try {
  // Capturar GPS de llegada
  let latLlegada = null, lonLlegada = null;
  try {
    if (navigator.geolocation) {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000})
      );
      latLlegada = pos.coords.latitude;
      lonLlegada = pos.coords.longitude;
    }
  } catch(e) { console.warn('GPS llegada no disponible:', e.message); }

  // Subir foto del odómetro de llegada a R2
  let fotoOdometroLlegadaUrl = null;
  const fotoLlegadaInput = document.getElementById('inp-foto-odometro-llegada');
  if (fotoLlegadaInput?.files?.[0]) {
    try {
      const viajeId = viajeAbierto.fbId || viajeAbierto.id;
      const reader2 = new FileReader();
      const dataUrl2 = await new Promise(res => { reader2.onload = e => res(e.target.result); reader2.readAsDataURL(fotoLlegadaInput.files[0]); });
      const blob2 = await (await fetch(dataUrl2)).blob();
      const uploadRes2 = await fetch(`${PHOTOS_PROXY_URL}/upload/${viajeId}/odometro_llegada.jpg`, {
        method: 'PUT', headers: { 'Content-Type': 'image/jpeg', 'X-ScanCheck-Token': PHOTOS_TOKEN }, body: blob2
      });
      if (uploadRes2.ok) fotoOdometroLlegadaUrl = (await uploadRes2.json()).url;
    } catch(e) { console.warn('Error subiendo foto odómetro llegada:', e.message); }
  }

    await fbUpdateViaje(viajeAbierto.fbId, {
      fechaLlegada: new Date().toISOString(),
      kmLlegada,
      kmRecorridos,
      distanciaGPS,
      latLlegada,
      lonLlegada,
      fotoOdometroLlegada: fotoOdometroLlegadaUrl,
      estado: 'cerrado'
    });
    // Update local
    const idx = localViajes.findIndex(v => v.fbId === viajeAbierto.fbId);
    if (idx !== -1) {
      localViajes[idx] = { ...localViajes[idx], fechaLlegada: new Date().toISOString(), kmLlegada, kmRecorridos, distanciaGPS, estado: 'cerrado' };
    }
    viajeAbierto = null;
    // Limpiar viaje abierto del localStorage
    try { localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id); } catch(e) {}
    closeModal('modal-viaje');
    renderViajeAbiertoBanner();
    renderViajes();
    showToast(`✓ Viaje cerrado — ${kmRecorridos.toLocaleString()} km recorridos`,'success');
  } catch(e) { showToast('Error al guardar: '+e.message,'error'); }
}
window.showIniciarViaje = showIniciarViaje;
window.guardarInicioViaje = guardarInicioViaje;
window.showCerrarViaje = showCerrarViaje;
window.guardarCierreViaje = guardarCierreViaje;

// ── REPORTE SERVICE ───────────────────────────────────────────
async function showReporteService() {
  const el = document.getElementById('modal-service-content');
  // Recuperar datos guardados previamente
  let saved = {};
  try {
    // Intentar cargar desde Firestore primero, localStorage como fallback
    const fromFirestore = await fbGetServiceData(currentUser.id);
    if (fromFirestore) {
      saved = fromFirestore;
    } else {
      const local = localStorage.getItem('scancheck_service_'+currentUser.id);
      if (local) saved = JSON.parse(local);
    }
  } catch(e) {
    try { saved = JSON.parse(localStorage.getItem('scancheck_service_'+currentUser.id)||'{}'); } catch(e2) {}
  }
  window._serviceDataSaved = saved; // hacer disponible para calcularReporteService

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🔧 Reporte para Service</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Ingresá los datos del último service para calcular los km laborales del período.</div>
    <div class="form-group">
      <label>Fecha del último service *</label>
      <input type="date" id="inp-service-fecha" value="${saved.fecha||''}">
    </div>
    <div class="form-group">
      <label>Km del odómetro en el último service *</label>
      <input type="number" id="inp-service-km" placeholder="Ej: 95000" value="${saved.km||''}" min="0">
    </div>
    <div class="form-group">
      <label>Km actuales del odómetro *</label>
      <input type="number" id="inp-service-km-actual" placeholder="Ej: 106500" value="${saved.kmActual||''}" min="0">
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Si tenés un viaje reciente, se puede tomar del último odómetro registrado.</div>
    </div>
    <div class="form-group">
      <label>Nombre del titular del vehículo</label>
      <input type="text" id="inp-service-titular" placeholder="Ej: Juan Pérez" value="${saved.titular||currentUser?.name||''}">
    </div>
    <div class="form-group">
      <label>Vehículo (marca, modelo, patente)</label>
      <input type="text" id="inp-service-vehiculo" placeholder="Ej: Renault Kangoo - AB 123 CD" value="${saved.vehiculo||''}">
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-service')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="calcularReporteService()">Calcular</button>
    </div>
  `;

  // Autocompletar km actual desde el último viaje cerrado
  const ultimoViaje = localViajes.filter(v=>v.estado==='cerrado'&&v.kmLlegada).sort((a,b)=>new Date(b.fechaLlegada)-new Date(a.fechaLlegada))[0];
  if (ultimoViaje?.kmLlegada && !saved.kmActual) {
    setTimeout(()=>{
      const inp = document.getElementById('inp-service-km-actual');
      if (inp && !inp.value) inp.value = ultimoViaje.kmLlegada;
    }, 50);
  }

  document.getElementById('modal-service').classList.remove('hidden');
}
window.showReporteService = showReporteService;

// ══════════════════════════════════════════════════════════════
// ── CONTROL DE VIÁTICOS ───────────────────────────────────────
// Registro continuo de gastos con foto/PDF de factura. El técnico
// carga el monto asignado y va registrando gastos manualmente.
// Al rendir genera un ZIP con la planilla .xlsx + PDF de fotos +
// PDFs digitales sueltos, y las fotos se respaldan en R2.
// ══════════════════════════════════════════════════════════════

const CONCEPTOS_VIATICO = ['Desayuno','Almuerzo','Merienda','Cena','Combustible','Peajes','Estacionamiento','Hospedaje','Otros'];

// Estado de la rendición activa en memoria
let _vt = null;

function showViaticos() {
  // Cargar rendición activa desde localStorage o crear una nueva
  if (!_vt) {
    try {
      const stored = localStorage.getItem('scancheck_viatico_activo_'+currentUser.id);
      _vt = stored ? JSON.parse(stored) : null;
    } catch(e) { _vt = null; }
  }
  if (!_vt) {
    _vt = { montoAsignado: '', gastos: [], fechaCreacion: new Date().toISOString() };
  }
  window._vt = _vt;
  document.getElementById('modal-viaticos').classList.remove('hidden');
  _vtRender();
  // Traer los gastos pendientes desde Firestore (sobreviven a limpiezas de
  // memoria / cambio de día o de equipo) y reintentar sincronizar lo que falte.
  _vtCargarPendientesRemotos();
}
window.showViaticos = showViaticos;

// Guarda la rendición en curso. Devuelve true si se pudo guardar.
// OJO: antes esto tenía un catch vacío y, cuando localStorage se llenaba
// (las fotos de los tickets van en base64 y ocupan mucho), el gasto se perdía
// sin que el técnico se enterara: cerraba la app y no estaba más.
function _vtPersistir() {
  try {
    // Aligeramos el localStorage: si la foto/PDF ya están en R2 (tienen URL) no
    // guardamos su base64 (que es lo que llenaba la cuota). Lo que TODAVÍA no
    // subió conserva su base64 acá para no perderse si se cierra la app offline.
    // Ojo: solo aligeramos la copia serializada; en memoria (_vt) el base64 se
    // mantiene intacto para poder armar el ZIP al toque.
    const gastosLite = (_vt.gastos || []).map(g => {
      const c = { ...g };
      if (g.fotoUrl && g.foto) c.foto = null;
      if (g.archivoPdfUrl && g.archivoPdf) c.archivoPdf = null;
      delete c._fotoCambiada;
      return c;
    });
    localStorage.setItem('scancheck_viatico_activo_'+currentUser.id, JSON.stringify({ ..._vt, gastos: gastosLite }));
    return true;
  } catch(e) {
    console.error('No se pudo guardar la rendición:', e.name, e.message);
    const sinEspacio = e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || /quota/i.test(e.message||'');
    if (sinEspacio) {
      showToast('⚠️ No hay espacio para guardar. Rendí los gastos que ya cargaste antes de seguir agregando.', 'error');
    } else {
      showToast('⚠️ No se pudo guardar el gasto: ' + e.message, 'error');
    }
    return false;
  }
}

// Espacio aproximado que ocupa la rendición actual, en MB.
function _vtPesoMB() {
  try { return (JSON.stringify(_vt).length / 1048576); } catch(e) { return 0; }
}

// ======== SYNC DE VIÁTICOS (igual que scanners) ========
// Cada gasto se sube a R2 (foto/PDF) y se guarda en Firestore apenas se carga,
// y queda disponible hasta que se arma la rendición. Diseño clave: el base64 se
// mantiene SIEMPRE en memoria durante la sesión; solo se saca de la copia que va
// al localStorage una vez que el archivo está confirmado en R2. Y antes de armar
// el ZIP se rehidrata desde R2 cualquier comprobante que haya perdido su base64,
// así las fotos NUNCA faltan en el ZIP.

// Sube un dataURL (foto o PDF) a R2 reutilizando el worker de fotos. Devuelve la URL.
async function _vtSubirArchivoR2(id, dataUrl, filename, contentType) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const up = await fetch(`${PHOTOS_PROXY_URL}/upload/${id}/${filename}`, {
    method: 'PUT',
    headers: { 'Content-Type': contentType, 'X-ScanCheck-Token': PHOTOS_TOKEN },
    body: blob,
  });
  if (!up.ok) throw new Error('R2 upload ' + up.status);
  const data = await up.json();
  return data.url;
}

// Baja un archivo de R2 y lo devuelve como dataURL base64 (para rehidratar el ZIP).
async function _vtDataUrlDesdeR2(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('R2 fetch ' + res.status);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// Sincroniza UN gasto a R2 + Firestore. Idempotente: si ya tiene fbId, actualiza.
// Si no hay conexión o falla, no rompe: el gasto queda en _vt/localStorage con su
// base64 y se reintenta al reconectar o al reabrir viáticos.
async function _vtSyncGasto(gasto) {
  if (!gasto || !currentUser || !navigator.onLine) return;
  try {
    if (!gasto._id) gasto._id = 'vtgasto_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    // Foto → R2 (si hay base64 y falta subir o cambió)
    if (gasto.foto && (!gasto.fotoUrl || gasto._fotoCambiada)) {
      gasto.fotoUrl = await _vtSubirArchivoR2(gasto._id, gasto.foto, `ticket_${Date.now()}.jpg`, 'image/jpeg');
      gasto._fotoCambiada = false;
    }
    // PDF → R2 (idem)
    if (gasto.archivoPdf && (!gasto.archivoPdfUrl || gasto._fotoCambiada)) {
      gasto.archivoPdfUrl = await _vtSubirArchivoR2(gasto._id, gasto.archivoPdf, `factura_${Date.now()}.pdf`, 'application/pdf');
    }
    // Doc → Firestore (colección viaticos_gastos)
    const docData = {
      userId: currentUser.id,
      userName: currentUser.name || currentUser.email,
      fecha: gasto.fecha || null, tipo: gasto.tipo || null, nroFactura: gasto.nroFactura || null,
      monto: gasto.monto || null, concepto: gasto.concepto || null, proyecto: gasto.proyecto || null,
      fotoUrl: gasto.fotoUrl || null, archivoPdfUrl: gasto.archivoPdfUrl || null,
      archivoPdfNombre: gasto.archivoPdfNombre || '',
      rendido: false, rendicionId: null,
      creadoEn: gasto.creadoEn || new Date().toISOString(),
    };
    if (gasto.fbId) await fbUpdateViaticoGasto(gasto.fbId, docData);
    else gasto.fbId = await fbSaveViaticoGasto(docData);
    // Ya está a salvo en la nube → persistir (esto libera el base64 pesado del localStorage)
    _vtPersistir();
  } catch (e) {
    console.warn('No se pudo sincronizar el gasto (se reintenta):', e.message);
  }
}

// Reintenta subir todo lo que haya quedado sin sincronizar en la rendición actual.
async function _vtSyncPendientes() {
  if (!_vt || !Array.isArray(_vt.gastos)) return;
  for (const g of _vt.gastos) {
    const faltaSubir = (g.foto && (!g.fotoUrl || g._fotoCambiada)) || (g.archivoPdf && !g.archivoPdfUrl);
    if (!g.fbId || faltaSubir) await _vtSyncGasto(g);
  }
}

// Trae los gastos pendientes desde Firestore y los mergea con lo local. Así los
// gastos sobreviven a limpiezas de memoria, cambio de día o de equipo.
async function _vtCargarPendientesRemotos() {
  if (!currentUser || !navigator.onLine) return;
  try {
    const remotos = await fbGetGastosPendientes(currentUser.id);
    let cambios = false;
    for (const r of remotos) {
      if (_vt.gastos.some(g => g.fbId === r.fbId)) continue;
      _vt.gastos.push({
        fbId: r.fbId, _id: r._id || null,
        fecha: r.fecha, tipo: r.tipo, nroFactura: r.nroFactura,
        monto: r.monto, concepto: r.concepto, proyecto: r.proyecto,
        foto: null, fotoUrl: r.fotoUrl || null,
        archivoPdf: null, archivoPdfUrl: r.archivoPdfUrl || null,
        archivoPdfNombre: r.archivoPdfNombre || '',
        creadoEn: r.creadoEn || null,
      });
      cambios = true;
    }
    // Restaurar el monto asignado si acá no lo tenemos (memoria limpia / otro equipo).
    try {
      const activo = await fbGetViaticoActivo(currentUser.id);
      if (activo && activo.montoAsignado != null && activo.montoAsignado !== '' && !_vt.montoAsignado) {
        _vt.montoAsignado = activo.montoAsignado;
        cambios = true;
      }
    } catch (e) { console.warn('No se pudo cargar el monto asignado:', e.message); }
    if (cambios) { _vtPersistir(); _vtRender(); }
    await _vtSyncPendientes();
  } catch (e) {
    console.warn('No se pudieron cargar gastos pendientes remotos:', e.message);
  }
}

// Antes de armar el ZIP, recupera desde R2 el base64 de cualquier comprobante que
// ya no lo tenga en memoria. GARANTÍA de que las fotos/PDF estén en el ZIP.
async function _vtRehidratarFotos() {
  for (const g of _vt.gastos) {
    try {
      if (!g.foto && g.fotoUrl) g.foto = await _vtDataUrlDesdeR2(g.fotoUrl);
      if (!g.archivoPdf && g.archivoPdfUrl) g.archivoPdf = await _vtDataUrlDesdeR2(g.archivoPdfUrl);
    } catch (e) {
      console.warn('No se pudo recuperar un comprobante desde R2 para el ZIP:', e.message);
    }
  }
}

// Al reconectar, reintentar sincronizar la rendición en curso.
window.addEventListener('online', () => {
  if (_vt) _vtSyncPendientes().then(() => { if (typeof _vtRender === 'function') _vtRender(); });
});

// Monto asignado: se guarda local en cada tecla y se sincroniza a Firestore con
// debounce, para que persista y siga disponible si se limpia memoria o se cambia
// de equipo. Al modificarlo, se actualiza en la nube.
let _vtMontoTimer = null;
function _vtSetMonto(valor) {
  _vt.montoAsignado = valor;
  window._vt = _vt;
  _vtActualizarSaldo();           // recalcula saldo y persiste local
  clearTimeout(_vtMontoTimer);
  _vtMontoTimer = setTimeout(_vtSyncMonto, 800);
}
window._vtSetMonto = _vtSetMonto;

async function _vtSyncMonto() {
  if (!currentUser || !navigator.onLine) return;
  try { await fbSaveViaticoActivo(currentUser.id, { montoAsignado: _vt.montoAsignado || '' }); }
  catch (e) { console.warn('No se pudo sincronizar el monto asignado:', e.message); }
}

function _vtRender() {
  const el = document.getElementById('modal-viaticos-content');
  if (!el) return;

  const monto = parseFloat(_vt.montoAsignado) || 0;
  const totalGastado = _vt.gastos.reduce((s,g) => s + (parseFloat(g.monto)||0), 0);
  const saldo = monto - totalGastado;
  const fmt = n => '$' + (n||0).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});

  const gastosHTML = _vt.gastos.length === 0
    ? '<div class="empty-state" style="padding:16px"><p>Sin gastos cargados</p></div>'
    : _vt.gastos.map((g, i) => {
        const fmtF = g.fecha ? new Date(g.fecha+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}) : '—';
        const icono = (g.archivoPdf || g.archivoPdfUrl) ? '📄' : ((g.foto || g.fotoUrl) ? '📷' : '📝');
        return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div style="flex:1;min-width:0;cursor:pointer" onclick="showCargarGasto(${i})">
            <div style="font-size:13px;font-weight:600;color:var(--text)">${icono} ${escHtml(g.concepto||'—')} · ${fmt(parseFloat(g.monto)||0)}</div>
            <div style="font-size:11px;color:var(--text3)">${fmtF} · Fac ${escHtml(g.tipo||'-')} N°${escHtml(g.nroFactura||'-')}${g.proyecto?' · '+escHtml(g.proyecto):''}</div>
          </div>
          <button onclick="showCargarGasto(${i})" title="Editar" style="background:transparent;border:none;color:var(--text3);font-size:14px;cursor:pointer;flex-shrink:0">✏️</button>
          <button onclick="_vtEliminarGasto(${i})" title="Eliminar" style="background:transparent;border:none;color:rgba(238,85,51,.7);font-size:16px;cursor:pointer;flex-shrink:0">×</button>
        </div>`;
      }).join('');

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🧾 Control de viáticos</div>

    <div class="form-group">
      <label>Monto de viáticos asignados *</label>
      <input type="number" id="vt-monto" placeholder="Ej: 150000" min="0" step="0.01" value="${_vt.montoAsignado}"
        oninput="_vtSetMonto(this.value)" style="font-size:18px;font-weight:700">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:15px;font-weight:700;color:var(--text)" id="vt-disp-asignado">${fmt(monto)}</div>
        <div style="font-size:10px;color:var(--text3)">Asignado</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:15px;font-weight:700;color:#e67e22" id="vt-disp-gastado">${fmt(totalGastado)}</div>
        <div style="font-size:10px;color:var(--text3)">Gastado</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:15px;font-weight:700;color:${saldo<0?'#e53':'#22c55e'}" id="vt-disp-saldo">${fmt(saldo)}</div>
        <div style="font-size:10px;color:var(--text3)">Saldo</div>
      </div>
    </div>

    <button class="btn-primary" style="width:100%;margin-bottom:16px" onclick="showCargarGasto()">➕ Cargar gasto</button>

    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:4px 0 8px">Gastos (${_vt.gastos.length})</div>
    <div id="vt-gastos-list">${gastosHTML}</div>

    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-viaticos')">Cerrar</button>
      <button class="btn-primary" style="flex:1;${_vt.gastos.length===0?'opacity:.4;pointer-events:none':''}" onclick="rendirViaticos()">📤 Rendir</button>
    </div>

    <div id="viaticos-hist-list" style="margin-top:8px"></div>`;

  renderViaticosHist();
}
window._vtRender = _vtRender;

function _vtActualizarSaldo() {
  const monto = parseFloat(_vt.montoAsignado) || 0;
  const totalGastado = _vt.gastos.reduce((s,g) => s + (parseFloat(g.monto)||0), 0);
  const saldo = monto - totalGastado;
  const fmt = n => '$' + (n||0).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});
  const a = document.getElementById('vt-disp-asignado');
  const s = document.getElementById('vt-disp-saldo');
  if (a) a.textContent = fmt(monto);
  if (s) { s.textContent = fmt(saldo); s.style.color = saldo<0?'#e53':'#22c55e'; }
  _vtPersistir();
}
window._vtActualizarSaldo = _vtActualizarSaldo;

function _vtEliminarGasto(i) {
  const g = _vt.gastos[i];
  _vt.gastos.splice(i, 1);
  _vtPersistir();
  _vtRender();
  // Borrar también el doc en Firestore (si ya se había sincronizado).
  if (g && g.fbId) fbDeleteViaticoGasto(g.fbId).catch(e => console.warn('No se pudo borrar el gasto en la nube:', e.message));
}
window._vtEliminarGasto = _vtEliminarGasto;

// ── Cargar gasto (modal) ──
let _gastoTmp = null;

// Abre el modal para cargar un gasto nuevo, o para editar uno ya cargado si se
// pasa su índice. Solo se puede editar mientras la rendición no se haya enviado.
function showCargarGasto(editIndex) {
  const gastoExistente = Number.isInteger(editIndex) ? _vt.gastos[editIndex] : null;
  if (gastoExistente) {
    const g = gastoExistente;
    // El gasto guardado tiene tipo y concepto ya resueltos: si el técnico eligió
    // "Otro", quedó el texto libre. Hay que volver a separarlos para que el
    // formulario muestre el selector y el campo de texto en el estado correcto.
    const esTipoFijo = ['A','B','C','M'].includes(g.tipo);
    const esConceptoFijo = CONCEPTOS_VIATICO.includes(g.concepto);
    _gastoTmp = {
      fecha: g.fecha || localDateKey(),
      tipo: esTipoFijo ? g.tipo : 'Otro',
      tipoOtro: esTipoFijo ? '' : (g.tipo || ''),
      nroFactura: g.nroFactura || '',
      monto: g.monto || '',
      concepto: esConceptoFijo ? g.concepto : 'Otros',
      conceptoOtro: esConceptoFijo ? '' : (g.concepto || ''),
      proyecto: g.proyecto || '',
      foto: g.foto || null,
      fotoUrl: g.fotoUrl || null,
      archivoPdf: g.archivoPdf || null,
      archivoPdfUrl: g.archivoPdfUrl || null,
      archivoPdfNombre: g.archivoPdfNombre || '',
      fbId: g.fbId || null,
      _id: g._id || null,
      _editIndex: editIndex,
    };
  } else {
    _gastoTmp = { fecha: localDateKey(), tipo: 'B', tipoOtro: '', nroFactura: '', monto: '', concepto: 'Almuerzo', conceptoOtro: '', proyecto: '', foto: null, archivoPdf: null, archivoPdfNombre: '', _editIndex: null };
  }
  window._gastoTmp = _gastoTmp;
  document.getElementById('modal-gasto').classList.remove('hidden');
  _gastoRender();
}
window.showCargarGasto = showCargarGasto;

function _gastoRender() {
  const el = document.getElementById('modal-gasto-content');
  if (!el) return;
  const g = _gastoTmp;

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">${_gastoTmp._editIndex != null ? '✏️ Editar gasto' : '➕ Cargar gasto'}</div>

    <div style="background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px">COMPROBANTE</div>
      <div style="display:flex;gap:8px">
        <input type="file" id="gasto-foto" accept="image/*" capture="environment" style="display:none" onchange="_gastoFoto(this)">
        <input type="file" id="gasto-pdf" accept="application/pdf" style="display:none" onchange="_gastoPdf(this)">
        <button onclick="document.getElementById('gasto-foto').click()" style="flex:1;padding:10px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg2);color:var(--text2);font-size:13px;cursor:pointer">📷 Escanear ticket</button>
        <button onclick="document.getElementById('gasto-pdf').click()" style="flex:1;padding:10px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg2);color:var(--text2);font-size:13px;cursor:pointer">📄 Subir PDF</button>
      </div>
      <div id="gasto-preview" style="margin-top:10px;text-align:center">${_gastoPreviewHTML()}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label>Fecha *</label>
        <input type="date" id="gasto-fecha" value="${g.fecha}" oninput="_gastoTmp.fecha=this.value">
      </div>
      <div class="form-group">
        <label>Tipo factura *</label>
        <select id="gasto-tipo" oninput="_gastoTmp.tipo=this.value;_gastoToggleTipoOtro()" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text)">
          <option value="A" ${g.tipo==='A'?'selected':''}>A</option>
          <option value="B" ${g.tipo==='B'?'selected':''}>B</option>
          <option value="C" ${g.tipo==='C'?'selected':''}>C</option>
          <option value="M" ${g.tipo==='M'?'selected':''}>M</option>
          <option value="Otro" ${g.tipo==='Otro'?'selected':''}>Otro</option>
        </select>
      </div>
    </div>

    <div id="gasto-tipo-otro-wrap" class="form-group" style="display:${g.tipo==='Otro'?'block':'none'}">
      <label>Especificar tipo de factura *</label>
      <input type="text" id="gasto-tipo-otro" placeholder="Ej: E, Ticket, Recibo" maxlength="20" value="${escHtml(g.tipoOtro||'')}" oninput="_gastoTmp.tipoOtro=this.value">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label>N° de factura *</label>
        <input type="text" id="gasto-nro" placeholder="0001-00001234" maxlength="30" value="${escHtml(g.nroFactura)}" oninput="_gastoTmp.nroFactura=this.value">
      </div>
      <div class="form-group">
        <label>Monto *</label>
        <input type="number" id="gasto-monto" placeholder="0.00" min="0" step="0.01" value="${g.monto}" oninput="_gastoTmp.monto=this.value" style="font-weight:700">
      </div>
    </div>

    <div class="form-group">
      <label>Concepto *</label>
      <select id="gasto-concepto" oninput="_gastoTmp.concepto=this.value;_gastoToggleOtro()" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text)">
        ${CONCEPTOS_VIATICO.map(c => `<option value="${c}" ${g.concepto===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>

    <div id="gasto-otro-wrap" class="form-group" style="display:${g.concepto==='Otros'?'block':'none'}">
      <label>Especificar concepto *</label>
      <input type="text" id="gasto-otro" placeholder="Ej: Insumos de limpieza" maxlength="60" value="${escHtml(g.conceptoOtro)}" oninput="_gastoTmp.conceptoOtro=this.value">
    </div>

    <div class="form-group">
      <label>Proyecto asociado</label>
      <input type="text" id="gasto-proyecto" placeholder="Ej: Proyecto Escáneres DNM" maxlength="60" value="${escHtml(g.proyecto)}" oninput="_gastoTmp.proyecto=this.value">
    </div>

    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-gasto')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="guardarGasto()">${_gastoTmp._editIndex != null ? 'Guardar cambios' : 'Guardar gasto'}</button>
    </div>`;
}

// Visor de imagen a pantalla completa (tap para cerrar). Sirve tanto para
// base64 en memoria como para URLs de R2.
function verFotoAmpliada(src) {
  if (!src) return;
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out';
  ov.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px">`;
  ov.onclick = () => ov.remove();
  document.body.appendChild(ov);
}
window.verFotoAmpliada = verFotoAmpliada;

function _gastoPreviewHTML() {
  const g = _gastoTmp;
  const src = g.foto || g.fotoUrl;
  if (src) return `<img src="${src}" onclick="verFotoAmpliada(_gastoTmp.foto || _gastoTmp.fotoUrl)" title="Tocar para ampliar" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid var(--border);cursor:zoom-in">`;
  if (g.archivoPdf || g.archivoPdfUrl) {
    const nombre = escHtml(g.archivoPdfNombre||'documento.pdf');
    return g.archivoPdfUrl
      ? `<div style="font-size:12px"><a href="${g.archivoPdfUrl}" target="_blank" style="color:var(--accent);text-decoration:underline">📄 ${nombre}</a></div>`
      : `<div style="font-size:12px;color:var(--accent)">📄 ${nombre}</div>`;
  }
  return '<div style="font-size:11px;color:var(--text3)">Sin comprobante adjunto</div>';
}

function _gastoToggleOtro() {
  const w = document.getElementById('gasto-otro-wrap');
  if (w) w.style.display = _gastoTmp.concepto === 'Otros' ? 'block' : 'none';
}
window._gastoToggleOtro = _gastoToggleOtro;

function _gastoToggleTipoOtro() {
  const w = document.getElementById('gasto-tipo-otro-wrap');
  if (w) w.style.display = _gastoTmp.tipo === 'Otro' ? 'block' : 'none';
}
window._gastoToggleTipoOtro = _gastoToggleTipoOtro;

function _gastoFoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    // En lugar de guardar directo, abrir el editor de recorte
    abrirEditorRecorte(e.target.result, (recortada) => {
      _gastoTmp.foto = recortada;
      _gastoTmp._fotoCambiada = true;
      _gastoTmp.archivoPdf = null;
      _gastoTmp.archivoPdfNombre = '';
      const prev = document.getElementById('gasto-preview');
      if (prev) prev.innerHTML = _gastoPreviewHTML();
    });
  };
  reader.readAsDataURL(file);
  // Limpiar el input para permitir volver a elegir la misma foto
  input.value = '';
}
window._gastoFoto = _gastoFoto;

// ══════════════════════════════════════════════════════════════
// ── EDITOR DE RECORTE DE IMAGEN ───────────────────────────────
// Editor liviano con canvas puro (sin librerías). Recuadro con 4
// esquinas arrastrables + rotación 90°. Pensado para gama baja.
// ══════════════════════════════════════════════════════════════
let _crop = null;

function abrirEditorRecorte(dataUrl, onConfirm) {
  _crop = {
    src: dataUrl,
    onConfirm,
    rotation: 0,
    img: null,
    box: null,
    dragging: null,
    canvasW: 0,
    canvasH: 0,
  };

  // Renderizar el contenido del modal PRIMERO (así siempre se ve algo)
  _cropRender();

  // Mostrar el modal por encima de los demás (z-index alto para apilar sobre modal-gasto)
  const modal = document.getElementById('modal-recorte');
  modal.style.zIndex = '9999';
  modal.classList.remove('hidden');

  // Cargar la imagen
  const img = new Image();
  img.onload = () => {
    _crop.img = img;
    _cropSetupCanvas();
  };
  img.onerror = () => {
    showToast('No se pudo cargar la imagen', 'error');
    closeModal('modal-recorte');
  };
  img.src = dataUrl;
  // Si la imagen ya está en caché, onload puede no dispararse: forzar
  if (img.complete && img.naturalWidth > 0) {
    _crop.img = img;
    _cropSetupCanvas();
  }
}
window.abrirEditorRecorte = abrirEditorRecorte;

function _cropRender() {
  const cont = document.getElementById('modal-recorte-content');
  if (!cont) return;
  cont.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:12px">✂️ Ajustar recorte</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:12px">Arrastrá las esquinas para ajustar al ticket</div>
    <div style="position:relative;width:100%;display:flex;justify-content:center;align-items:center;min-height:200px;background:var(--bg3);border-radius:10px;padding:8px;margin-bottom:12px">
      <canvas id="crop-canvas" style="max-width:100%;touch-action:none;border-radius:6px"></canvas>
      <div id="crop-loading" style="position:absolute;font-size:12px;color:var(--text3)">Cargando imagen...</div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:10px">
      <button class="btn-secondary" style="flex:1" onclick="_cropRotar()">↻ Rotar 90°</button>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn-secondary" style="flex:1" onclick="_cropCancelar()">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="_cropConfirmar()">✓ Confirmar</button>
    </div>`;
}

function _cropSetupCanvas() {
  const canvas = document.getElementById('crop-canvas');
  if (!canvas || !_crop.img) return;
  const ctx = canvas.getContext('2d');

  // Dimensiones de la imagen según rotación
  const rot = _crop.rotation % 360;
  const swap = (rot === 90 || rot === 270);
  const iw = swap ? _crop.img.height : _crop.img.width;
  const ih = swap ? _crop.img.width : _crop.img.height;

  // Escalar para que quepa en pantalla (máx 320px de ancho para gama baja)
  const maxW = Math.min(320, (document.getElementById('modal-recorte-content').clientWidth || 320) - 32);
  const scale = Math.min(maxW / iw, 400 / ih, 1);
  const cw = Math.round(iw * scale);
  const ch = Math.round(ih * scale);
  canvas.width = cw;
  canvas.height = ch;
  _crop.canvasW = cw;
  _crop.canvasH = ch;
  _crop.scale = scale;

  // Inicializar caja de recorte al 90% del área si no existe
  if (!_crop.box) {
    const m = Math.round(Math.min(cw, ch) * 0.06);
    _crop.box = { x1: m, y1: m, x2: cw - m, y2: ch - m };
  } else {
    // Ajustar la caja si cambió el tamaño (tras rotar)
    _crop.box = { x1: 8, y1: 8, x2: cw - 8, y2: ch - 8 };
  }

  _cropDraw();
  _cropBindEvents(canvas);
  // Ocultar el "Cargando imagen..."
  const loading = document.getElementById('crop-loading');
  if (loading) loading.style.display = 'none';
}

function _cropDraw() {
  const canvas = document.getElementById('crop-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { canvasW: cw, canvasH: ch, box } = _crop;

  ctx.clearRect(0, 0, cw, ch);

  // Dibujar imagen rotada
  ctx.save();
  const rot = _crop.rotation % 360;
  ctx.translate(cw/2, ch/2);
  ctx.rotate(rot * Math.PI / 180);
  if (rot === 90 || rot === 270) {
    ctx.drawImage(_crop.img, -ch/2, -cw/2, ch, cw);
  } else {
    ctx.drawImage(_crop.img, -cw/2, -ch/2, cw, ch);
  }
  ctx.restore();

  // Oscurecer todo menos la caja
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, cw, box.y1);
  ctx.fillRect(0, box.y2, cw, ch - box.y2);
  ctx.fillRect(0, box.y1, box.x1, box.y2 - box.y1);
  ctx.fillRect(box.x2, box.y1, cw - box.x2, box.y2 - box.y1);

  // Borde de la caja
  ctx.strokeStyle = '#00d4aa';
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

  // Esquinas
  const corners = [[box.x1,box.y1],[box.x2,box.y1],[box.x2,box.y2],[box.x1,box.y2]];
  ctx.fillStyle = '#00d4aa';
  corners.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI*2);
    ctx.fill();
  });
}

function _cropBindEvents(canvas) {
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
  };

  const cornerAt = (p) => {
    const b = _crop.box;
    const corners = [[b.x1,b.y1],[b.x2,b.y1],[b.x2,b.y2],[b.x1,b.y2]];
    for (let i = 0; i < 4; i++) {
      const dx = p.x - corners[i][0], dy = p.y - corners[i][1];
      if (Math.sqrt(dx*dx + dy*dy) < 22) return i;
    }
    // ¿Dentro de la caja? → mover
    if (p.x > b.x1 && p.x < b.x2 && p.y > b.y1 && p.y < b.y2) return 'move';
    return null;
  };

  const start = (e) => {
    e.preventDefault();
    const p = getPos(e);
    _crop.dragging = cornerAt(p);
    _crop.lastPos = p;
  };

  const move = (e) => {
    if (_crop.dragging === null) return;
    e.preventDefault();
    const p = getPos(e);
    const b = _crop.box;
    const cw = _crop.canvasW, ch = _crop.canvasH;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    if (_crop.dragging === 'move') {
      const dx = p.x - _crop.lastPos.x, dy = p.y - _crop.lastPos.y;
      const w = b.x2 - b.x1, h = b.y2 - b.y1;
      let nx1 = clamp(b.x1 + dx, 0, cw - w);
      let ny1 = clamp(b.y1 + dy, 0, ch - h);
      b.x1 = nx1; b.y1 = ny1; b.x2 = nx1 + w; b.y2 = ny1 + h;
    } else {
      const i = _crop.dragging;
      const minSize = 30;
      if (i === 0) { b.x1 = clamp(p.x, 0, b.x2 - minSize); b.y1 = clamp(p.y, 0, b.y2 - minSize); }
      if (i === 1) { b.x2 = clamp(p.x, b.x1 + minSize, cw); b.y1 = clamp(p.y, 0, b.y2 - minSize); }
      if (i === 2) { b.x2 = clamp(p.x, b.x1 + minSize, cw); b.y2 = clamp(p.y, b.y1 + minSize, ch); }
      if (i === 3) { b.x1 = clamp(p.x, 0, b.x2 - minSize); b.y2 = clamp(p.y, b.y1 + minSize, ch); }
    }
    _crop.lastPos = p;
    _cropDraw();
  };

  const end = () => { _crop.dragging = null; };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
}

function _cropRotar() {
  _crop.rotation = (_crop.rotation + 90) % 360;
  _crop.box = null; // recalcular caja tras rotar
  _cropSetupCanvas();
}
window._cropRotar = _cropRotar;

function _cropConfirmar() {
  const { img, box, rotation, scale } = _crop;

  // Canvas temporal con la imagen rotada a resolución completa
  const rot = rotation % 360;
  const swap = (rot === 90 || rot === 270);
  const fullW = swap ? img.height : img.width;
  const fullH = swap ? img.width : img.height;

  const tmp = document.createElement('canvas');
  tmp.width = fullW; tmp.height = fullH;
  const tctx = tmp.getContext('2d');
  tctx.save();
  tctx.translate(fullW/2, fullH/2);
  tctx.rotate(rot * Math.PI / 180);
  if (swap) tctx.drawImage(img, -fullH/2, -fullW/2, fullH, fullW);
  else tctx.drawImage(img, -fullW/2, -fullH/2, fullW, fullH);
  tctx.restore();

  // Recortar según la caja (convertir coords de canvas a coords reales)
  const sx = box.x1 / scale;
  const sy = box.y1 / scale;
  const sw = (box.x2 - box.x1) / scale;
  const sh = (box.y2 - box.y1) / scale;

  // Reducir a un máximo razonable: un ticket a 1600px se lee perfecto y pesa
  // ~10 veces menos. Sin esto, el recorte salía a la resolución completa de la
  // cámara (~2000x2800), daba >1 MB y en base64 ~1,4 MB: dos o tres gastos
  // reventaban la cuota de localStorage y el gasto se perdía sin aviso.
  const MAX_LADO = 1600;
  const escalaOut = Math.min(1, MAX_LADO / Math.max(sw, sh));
  const out = document.createElement('canvas');
  out.width = Math.round(sw * escalaOut);
  out.height = Math.round(sh * escalaOut);
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(tmp, sx, sy, sw, sh, 0, 0, out.width, out.height);

  // Exportar como JPEG con calidad razonable (comprime para no saturar R2)
  const result = out.toDataURL('image/jpeg', 0.85);

  const modal = document.getElementById('modal-recorte');
  if (modal) modal.style.zIndex = '';
  closeModal('modal-recorte');
  if (_crop && _crop.onConfirm) _crop.onConfirm(result);
  _crop = null;
}
window._cropConfirmar = _cropConfirmar;

function _cropCancelar() {
  const modal = document.getElementById('modal-recorte');
  if (modal) modal.style.zIndex = '';
  closeModal('modal-recorte');
  _crop = null;
}
window._cropCancelar = _cropCancelar;
// ── FIN EDITOR DE RECORTE ─────────────────────────────────────

function _gastoPdf(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _gastoTmp.archivoPdf = e.target.result; // dataURL base64
    _gastoTmp.archivoPdfNombre = file.name;
    _gastoTmp._fotoCambiada = true;
    _gastoTmp.foto = null;
    document.getElementById('gasto-preview').innerHTML = _gastoPreviewHTML();
  };
  reader.readAsDataURL(file);
}
window._gastoPdf = _gastoPdf;

function guardarGasto() {
  const g = _gastoTmp;
  if (!g.fecha || !g.nroFactura.trim() || !g.monto || !g.concepto) {
    showToast('Completá fecha, N° factura, monto y concepto', 'error'); return;
  }
  if (g.tipo === 'Otro' && !(g.tipoOtro||'').trim()) {
    showToast('Especificá el tipo de factura', 'error'); return;
  }
  if (g.concepto === 'Otros' && !g.conceptoOtro.trim()) {
    showToast('Especificá el concepto', 'error'); return;
  }
  const tipoFinal = g.tipo === 'Otro' ? g.tipoOtro.trim() : g.tipo;
  const conceptoFinal = g.concepto === 'Otros' ? g.conceptoOtro.trim() : g.concepto;
  const editando = g._editIndex != null && _vt.gastos[g._editIndex];
  const prev = editando ? _vt.gastos[g._editIndex] : null;
  const gastoFinal = {
    ...(prev || {}),  // conserva fbId / _id / fotoUrl / archivoPdfUrl si es edición
    fecha: g.fecha, tipo: tipoFinal, nroFactura: g.nroFactura.trim(),
    monto: g.monto, concepto: conceptoFinal, proyecto: g.proyecto.trim(),
    foto: g.foto, archivoPdf: g.archivoPdf, archivoPdfNombre: g.archivoPdfNombre,
    _fotoCambiada: !!g._fotoCambiada || !prev,          // foto nueva o gasto nuevo
    creadoEn: (prev && prev.creadoEn) || new Date().toISOString(),
  };
  if (editando) _vt.gastos[g._editIndex] = gastoFinal;
  else _vt.gastos.push(gastoFinal);

  const guardado = _vtPersistir();
  closeModal('modal-gasto');
  _vtRender();
  // Si no se pudo guardar, _vtPersistir ya avisó por qué: no lo tapamos con
  // un "✓ Gasto agregado" que haría creer al técnico que quedó a salvo.
  // El gasto igual queda en memoria, así que puede rendir sin perderlo.
  if (guardado) showToast(editando ? '✓ Gasto actualizado' : '✓ Gasto agregado', 'success');
  // Sincronizar a R2 + Firestore en segundo plano, igual que un scanner.
  _vtSyncGasto(gastoFinal).then(() => { if (typeof _vtRender === 'function') _vtRender(); });
}
window.guardarGasto = guardarGasto;

// ── Rendir viáticos: muestra modal de advertencia y pre-genera el ZIP ──
function rendirViaticos() {
  if (_vt.gastos.length === 0) return;
  const monto = parseFloat(_vt.montoAsignado) || 0;
  if (!monto) { showToast('Ingresá el monto de viáticos asignados', 'error'); return; }
  if (!navigator.onLine) { showToast('Necesitás conexión para rendir', 'error'); return; }

  if (document.getElementById('modal-rendir-confirm')) return;

  const totalGastado = _vt.gastos.reduce((s,g) => s + (parseFloat(g.monto)||0), 0);
  const saldo = monto - totalGastado;
  const fmt = n => '$' + (n||0).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});
  const nGastos = _vt.gastos.length;

  // Empezar a generar el ZIP YA (mientras el técnico lee el resumen).
  // Así cuando toque "Rendir" el archivo está listo y el share se dispara
  // de forma síncrona, sin await que rompa el gesto del usuario (Chrome Android).
  window._vtZipListo = null;
  window._vtZipPromise = _vtPrepararZip();

  const modal = document.createElement('div');
  modal.id = 'modal-rendir-confirm';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';

  modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:360px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
    <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;text-align:center">
      ⚠️ Cerrar rendición de viáticos
    </div>
    <div style="font-size:12px;color:var(--text3);text-align:center;margin-bottom:16px">
      Se descargará el archivo ZIP y se abrirá Gmail con el mail listo. Solo tenés que adjuntar el archivo descargado y enviar. El registro actual se vaciará.
    </div>
    <div style="background:var(--bg3);border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px">
        <span style="color:var(--text3)">Gastos</span><strong style="color:var(--text)">${nGastos}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px">
        <span style="color:var(--text3)">Asignado</span><strong style="color:var(--text)">${fmt(monto)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px">
        <span style="color:var(--text3)">Gastado</span><strong style="color:#e67e22">${fmt(totalGastado)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-top:1px solid var(--border);margin-top:4px;padding-top:8px">
        <span style="color:var(--text3)">Saldo</span><strong style="color:${saldo<0?'#ef4444':'#22c55e'}">${fmt(saldo)}</strong>
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="modal-rendir-cancelar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Cancelar</button>
      <button id="modal-rendir-ok" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer">📤 Rendir</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  document.getElementById('modal-rendir-cancelar').onclick = () => { modal.remove(); window._vtZipPromise = null; };
  document.getElementById('modal-rendir-ok').onclick = () => {
    modal.remove();
    _compartirRendicion();
  };
}
window.rendirViaticos = rendirViaticos;

// Prepara el ZIP y lo deja en window._vtZipListo
async function _vtPrepararZip() {
  const fechaStr = localDateKey();
  const nombreZip = `Rendicion_Viaticos_${fechaStr}.zip`;
  // GARANTÍA: las fotos/PDF tienen que estar en el ZIP sí o sí. Si el base64 se
  // limpió de memoria porque ya estaba en R2, lo recuperamos desde R2 acá.
  await _vtRehidratarFotos();

  const xlsxBlob = _vtGenerarExcel();
  const zip = new JSZip();
  zip.file(`Planilla_Gastos_${fechaStr}.xlsx`, xlsxBlob);

  // ── Fotos de tickets: separadas por tipo de factura ──
  // A, C y M → un PDF individual por cada foto.
  // B y cualquier otro tipo → un solo PDF, una foto legible por página.
  const conFoto = _vt.gastos.filter(g => g.foto);
  const individuales = conFoto.filter(g => ['A','C','M'].includes(g.tipo));
  const agrupadas   = conFoto.filter(g => !['A','C','M'].includes(g.tipo)); // B y otros

  // PDFs individuales (uno por foto): nombre = tipo + número + fecha
  individuales.forEach((g, i) => {
    const pdf = _vtPdfDeGastos([g]);
    if (pdf) {
      const nombre = `Factura_${_vtSafeName(g.tipo)}_${_vtSafeName(g.nroFactura)}_${_vtSafeName(g.fecha)}.pdf`;
      // Evitar colisión si dos gastos tienen mismo tipo/número/fecha
      zip.file(`facturas_${g.tipo}/${i+1}_${nombre}`, pdf);
    }
  });

  // PDF conjunto para B y otros (una foto por página, sin achicar)
  if (agrupadas.length > 0) {
    const pdfB = _vtPdfDeGastos(agrupadas);
    if (pdfB) zip.file(`Facturas_B_y_otras_${fechaStr}.pdf`, pdfB);
  }

  // Archivos PDF digitales subidos por el técnico: siguen sueltos como estaban
  _vt.gastos.forEach((g, i) => {
    if (g.archivoPdf) {
      const base64 = g.archivoPdf.split(',')[1];
      const nombre = g.archivoPdfNombre || `factura_${i+1}.pdf`;
      zip.file(`facturas_pdf/${nombre}`, base64, { base64: true });
    }
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFile = new File([zipBlob], nombreZip, { type: 'application/zip' });
  window._vtZipListo = { zipBlob, zipFile, nombreZip, fechaStr };
  return window._vtZipListo;
}

// Comparte el ZIP (share síncrono si ya está listo) y luego guarda respaldo
async function _compartirRendicion() {
  const monto = parseFloat(_vt.montoAsignado) || 0;
  const totalGastado = _vt.gastos.reduce((s,g) => s + (parseFloat(g.monto)||0), 0);
  const fmt = n => '$' + (n||0).toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});
  const cantidadGastos = _vt.gastos.length;
  const gastosSnapshot = _vt.gastos.slice();
  const rendicionId = 'vt_' + Date.now();

  // Esperar a que el ZIP esté listo SOLO si todavía no terminó.
  // En la mayoría de los casos ya está (se generó mientras leía el modal).
  let z = window._vtZipListo;
  if (!z) {
    try { z = await window._vtZipPromise; } catch(e) {}
  }
  if (!z) { showToast('Error generando el archivo', 'error'); return; }

  const { zipBlob, zipFile, nombreZip, fechaStr } = z;

  // ── Compartir (idealmente síncrono: el ZIP ya está listo) ──
  // ── Descargar el ZIP ──
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url; a.download = nombreZip; a.click();
  URL.revokeObjectURL(url);

  // ── Abrir Gmail con el mail prellenado (el técnico adjunta el ZIP descargado) ──
  const para = 'comprobantes@danaide.com.ar';
  const cc = ['elopapa@danaide.com.ar','rsifontes@danaide.com.ar','spizzola@danaide.com.ar','vialinksrl@gmail.com'].join(',');
  const asunto = `Rendición de viáticos - ${currentUser.name || currentUser.email} - ${fechaStr}`;
  const cuerpo =
    `Buenos días,\n\n` +
    `Adjunto la rendición de viáticos correspondiente.\n\n` +
    `Fecha: ${fechaStr}\n` +
    `Monto asignado: ${fmt(monto)}\n` +
    `Total gastado: ${fmt(totalGastado)}\n` +
    `Saldo: ${fmt(monto-totalGastado)}\n` +
    `Cantidad de comprobantes: ${cantidadGastos}\n\n` +
    `Se adjunta el archivo ${nombreZip} con la planilla de gastos y los comprobantes.\n\n` +
    `IMPORTANTE: adjuntar el archivo ${nombreZip} que se acaba de descargar antes de enviar.\n\n` +
    `Saludos.`;

  // mailto: — la app de Gmail en Android lo interpreta y abre un mail nuevo
  // con destinatario, copias, asunto y cuerpo cargados.
  const mailtoUrl = `mailto:${encodeURIComponent(para)}` +
    `?cc=${encodeURIComponent(cc)}` +
    `&subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  // Pequeño delay para que arranque la descarga antes de abrir el mail
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 800);

  showToast('Archivo descargado — adjuntalo en el mail', '');

  // ── Respaldo en R2 + Firestore (después del share) ──
  showToast('Guardando respaldo...', '');
  // Cada gasto ya subió su foto a R2 al cargarse, así que reutilizamos esas URLs.
  let fotoUrls = gastosSnapshot.map(g => g.fotoUrl).filter(Boolean);
  try {
    // Respaldo: si algún gasto no tenía su foto en R2, la subimos ahora.
    const faltantes = gastosSnapshot.filter(g => g.foto && !g.fotoUrl).map(g => g.foto);
    if (faltantes.length > 0) fotoUrls = fotoUrls.concat(await uploadPhotosToR2(rendicionId, faltantes));
  } catch(e) { console.warn('No se pudieron subir fotos faltantes a R2:', e.message); }

  const rendicion = {
    id: rendicionId,
    userId: currentUser.id,
    userName: currentUser.name || currentUser.email,
    fechaCreacion: new Date().toISOString(),
    montoAsignado: monto,
    totalGastado,
    saldo: monto - totalGastado,
    cantidadGastos,
    fotoUrls,
    gastos: gastosSnapshot.map(g => ({
      fecha: g.fecha, tipo: g.tipo, nroFactura: g.nroFactura,
      monto: g.monto, concepto: g.concepto, proyecto: g.proyecto,
      tieneFoto: !!g.foto, tienePdf: !!g.archivoPdf, archivoPdfNombre: g.archivoPdfNombre || '',
    })),
  };
  try { await fbSaveViaticoRendicion(rendicion); } catch(e) { console.warn('No se pudo guardar rendición:', e.message); }

  // Marcar los gastos individuales como rendidos para que dejen de aparecer
  // como pendientes (pero queden en la nube, ya asociados a esta rendición).
  try {
    const fbIds = gastosSnapshot.map(g => g.fbId).filter(Boolean);
    if (fbIds.length > 0) await fbMarcarGastosRendidos(fbIds, rendicionId);
  } catch(e) { console.warn('No se pudieron marcar los gastos como rendidos:', e.message); }

  // Cerrar la rendición activa: borrar el monto asignado guardado en la nube.
  try { await fbClearViaticoActivo(currentUser.id); } catch(e) {}

  // Limpiar
  _vt = null; window._vt = null;
  window._vtZipListo = null; window._vtZipPromise = null;
  localStorage.removeItem('scancheck_viatico_activo_'+currentUser.id);
  closeModal('modal-viaticos');
  showToast('✓ Rendición completada', 'success');
}
window._compartirRendicion = _compartirRendicion;


// Genera la planilla .xlsx con el formato oficial de Danaide
function _vtGenerarExcel() {
  const monto = parseFloat(_vt.montoAsignado) || 0;
  const hoy = new Date().toLocaleDateString('es-AR');

  // Construir matriz de celdas (AOA) replicando la planilla
  const aoa = [];
  aoa[0] = ['', 'RECEPCIÓN DEL FORMULARIO:', '', '', '', '', 'FECHA DE RENDICIÓN:', hoy];
  aoa[1] = ['', '', '', '', '', '', 'ÁREA:', ''];
  aoa[2] = ['', '', '', '', '', '', '', ''];
  aoa[3] = ['', '', '', '', '', '', '', ''];
  aoa[4] = ['', 'FIRMA Y ACLARACIÓN DEL RESPONSABLE:', '', '', '', '', 'SALDO:', monto];
  aoa[5] = ['', '', '', '', '', '', '', ''];
  aoa[6] = ['', '', '', '', '', '', '', ''];
  aoa[7] = ['', 'RESUMEN DE GASTOS', '', '', '', '', '', ''];
  aoa[8] = ['', 'Fecha', 'Tipo', 'Nro de Factura', 'Gastos', 'Saldo', 'Proyecto Asociado', 'Detalle'];

  let saldoAcum = monto;
  _vt.gastos.forEach((g, i) => {
    const gasto = parseFloat(g.monto) || 0;
    saldoAcum -= gasto;
    const fechaF = g.fecha ? new Date(g.fecha+'T12:00:00').toLocaleDateString('es-AR') : '';
    aoa[9 + i] = ['', fechaF, g.tipo || '', g.nroFactura || '', gasto, saldoAcum, g.proyecto || '', g.concepto || ''];
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{wch:2},{wch:14},{wch:8},{wch:18},{wch:14},{wch:14},{wch:22},{wch:20}];
  ws['!merges'] = [{ s:{r:7,c:1}, e:{r:7,c:7} }]; // "RESUMEN DE GASTOS"

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// Genera un PDF con una lista de gastos (con foto), una foto por página a
// tamaño legible (sin achicar para meter varias por hoja).
function _vtPdfDeGastos(gastos) {
  if (!gastos || gastos.length === 0) return null;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = 210, ph = 297, margin = 15;

  gastos.forEach((g, i) => {
    if (i > 0) doc.addPage();
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.setFont(undefined, 'bold');
    doc.text(`${g.concepto} — ${g.tipo} N° ${g.nroFactura}`, margin, margin);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100);
    const fechaF = g.fecha ? new Date(g.fecha+'T12:00:00').toLocaleDateString('es-AR') : '';
    const monto = '$' + (parseFloat(g.monto)||0).toLocaleString('es-AR',{minimumFractionDigits:2});
    doc.text(`${fechaF} · ${monto}${g.proyecto?' · '+g.proyecto:''}`, margin, margin + 6);
    try {
      const props = doc.getImageProperties(g.foto);
      const maxW = pw - margin*2;
      const maxH = ph - margin*2 - 15;
      let w = props.width, h = props.height;
      const ratio = Math.min(maxW/w, maxH/h);
      w = w * ratio; h = h * ratio;
      const fmt = g.foto.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(g.foto, fmt, margin, margin + 12, w, h);
    } catch(e) {}
  });
  return doc.output('blob');
}

// Normaliza un texto para usarlo en nombre de archivo (sin caracteres raros)
function _vtSafeName(s) {
  return String(s || '').replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '') || 'sin_dato';
}

// (compat) PDF único con todas las fotos — ya no se usa en la rendición,
// se mantiene por si alguna llamada externa lo referencia.
function _vtGenerarPdfFotos() {
  return _vtPdfDeGastos(_vt.gastos.filter(g => g.foto));
}

// ── Historial de rendiciones (on-demand) ──
function renderViaticosHist() {
  const el = document.getElementById('viaticos-hist-list');
  if (!el) return;
  el.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px;display:flex;justify-content:space-between;align-items:center">
      <span>Rendiciones anteriores</span>
      <button id="btn-ver-viaticos" onclick="cargarViaticosHist()" style="font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text2);cursor:pointer">Ver</button>
    </div>
    <div id="viaticos-hist-content"><div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div></div>`;
}
window.renderViaticosHist = renderViaticosHist;

async function cargarViaticosHist() {
  const el = document.getElementById('viaticos-hist-content');
  const btn = document.getElementById('btn-ver-viaticos');
  if (!el) return;
  if (el.dataset.cargado === '1') {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div>';
    el.dataset.cargado = '0'; if (btn) btn.textContent = 'Ver'; return;
  }
  el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:12px">Cargando...</div>';
  if (btn) btn.textContent = 'Ocultar';
  if (!navigator.onLine) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px">Sin conexión</div>';
    if (btn) btn.textContent = 'Ver'; return;
  }
  try {
    const rends = (await fbGetMyViaticos(currentUser.id)).filter(r => !r.eliminado);
    if (rends.length === 0) {
      el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Sin rendiciones anteriores</div>';
      el.dataset.cargado = '1'; return;
    }
    const fmt = n => '$' + (n||0).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
    el.innerHTML = rends.map(r => {
      const fecha = r.fechaCreacion ? new Date(r.fechaCreacion).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">🧾 Rendición ${fecha}</div>
          <div style="font-size:12px;font-weight:700;color:#e67e22">${fmt(r.totalGastado)}</div>
        </div>
        <div style="font-size:11px;color:var(--text3)">Asignado ${fmt(r.montoAsignado)} · Saldo ${fmt(r.saldo)} · ${r.cantidadGastos||0} gastos</div>
        <button onclick="eliminarViatico('${r.fbId}')" style="width:100%;margin-top:8px;padding:7px;border-radius:8px;border:1px solid rgba(238,85,51,.3);background:rgba(238,85,51,.06);color:#e55;font-size:12px;font-weight:600;cursor:pointer">🗑 Eliminar</button>
      </div>`;
    }).join('');
    el.dataset.cargado = '1';
  } catch(e) {
    el.innerHTML = `<div style="font-size:12px;color:#e55;text-align:center;padding:8px">Error: ${escHtml(e.message)}</div>`;
    if (btn) btn.textContent = 'Ver';
  }
}
window.cargarViaticosHist = cargarViaticosHist;

async function eliminarViatico(fbId) {
  if (!confirm('¿Eliminar esta rendición? Va a la papelera del supervisor.')) return;
  try {
    await fbSoftDeleteViatico(fbId, currentUser?.id);
    // Forzar refresh de la lista (marcar como no cargado y volver a cargar)
    const cont = document.getElementById('viaticos-hist-content');
    if (cont) cont.dataset.cargado = '0';
    await cargarViaticosHist();
    showToast('Rendición enviada a papelera', 'success');
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.eliminarViatico = eliminarViatico;

// ── Supervisor: viáticos de todos los técnicos ──
async function loadSupViaticos() {
  const el = document.getElementById('sup-viajes-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando viáticos...</div>';
  try {
    const rends = (await fbGetAllViaticos()).filter(r => !r.eliminado);
    if (rends.length === 0) { el.innerHTML = '<div class="empty-state"><p>Sin rendiciones de viáticos</p></div>'; return; }
    const fmt = n => '$' + (n||0).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
    el.innerHTML = rends.map(r => {
      const fecha = r.fechaCreacion ? new Date(r.fechaCreacion).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      const gastosHTML = (r.gastos||[]).map(g => {
        const f = g.fecha ? new Date(g.fecha+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}) : '—';
        return `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px">
          <span style="color:var(--text3)">${f} · ${escHtml(g.concepto||'—')} (${escHtml(g.tipo||'-')})</span>
          <span style="color:var(--text2);font-weight:600">${fmt(parseFloat(g.monto)||0)}</span>
        </div>`;
      }).join('');
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(r.userName||'—')}</div>
          <div style="font-size:12px;font-weight:700;color:#e67e22">${fmt(r.totalGastado)}</div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">${fecha} · Asignado ${fmt(r.montoAsignado)} · Saldo ${fmt(r.saldo)}</div>
        <div style="border-top:1px solid var(--border);padding-top:6px">${gastosHTML}</div>
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><p>Error: ${escHtml(e.message)}</p></div>`;
  }
}
window.loadSupViaticos = loadSupViaticos;
// ── FIN CONTROL DE VIÁTICOS ───────────────────────────────────


// ══════════════════════════════════════════════════════════════
// ── PROGRAMAR VIAJE ───────────────────────────────────────────
// Wizard de 3 pasos para programar un viaje operativo según la
// Política de Viajes Operativos de Danaide.
// Genera un PDF con el formato del Anexo I del procedimiento.
// ══════════════════════════════════════════════════════════════

// Estado del wizard (se resetea al abrir)
let _pv = {};
window._pv = _pv;

function showProgramarViaje() {
  // Resetear estado
  _pv = window._pv = {
    paso: 1,
    proyecto: '',
    centroCosto: '',
    fechaInicio: '',
    fechaFin: '',
    kmEstimados: '',
    responsableArea: '',
    observaciones: '',
    ciudadOrigen: currentUser?.ciudad || '',
    viajeros: [{ nombre: '', apellido: '', dni: '', empresa: 'Danaide' }],
    paradas: [{ ciudad: '', provincia: '', noches: '', fecha: '' }],
    servicios: { vehiculoPropio: false, alquilerAuto: false, vuelo: false, hospedaje: false, cochera: false },
    franjaHorariaIda: '',
    franjaHorariaVuelta: '',
    urlRecorrido: '',
  };
  document.getElementById('modal-programar-viaje').classList.remove('hidden');
  _pvRenderPaso();
}
window.showProgramarViaje = showProgramarViaje;

function _pvRenderPaso() {
  const el = document.getElementById('modal-programar-viaje-content');
  if (!el) return;
  const pasos = ['Datos generales', 'Viajeros', 'Itinerario'];
  const indicadores = pasos.map((p, i) => {
    const n = i + 1;
    const activo = n === _pv.paso ? `background:var(--accent);color:#0a1628` : n < _pv.paso ? `background:rgba(0,212,170,.3);color:var(--accent)` : `background:var(--bg3);color:var(--text3)`;
    return `<div style="display:flex;align-items:center;gap:6px;flex:1;${n < pasos.length ? 'margin-right:4px' : ''}">
      <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;${activo}">${n < _pv.paso ? '✓' : n}</div>
      <div style="font-size:11px;color:${n === _pv.paso ? 'var(--text)' : 'var(--text3)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p}</div>
      ${n < pasos.length ? '<div style="flex:1;height:1px;background:var(--border);margin-left:4px"></div>' : ''}
    </div>`;
  }).join('');

  let contenido = '';
  if (_pv.paso === 1) contenido = _pvPaso1HTML();
  if (_pv.paso === 2) contenido = _pvPaso2HTML();
  if (_pv.paso === 3) contenido = _pvPaso3HTML();

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🗓️ Programar viaje</div>
    <div style="display:flex;align-items:center;margin-bottom:20px">${indicadores}</div>
    ${contenido}
    <div style="display:flex;gap:10px;margin-top:20px">
      <button class="btn-secondary" style="flex:1" onclick="${_pv.paso === 1 ? "closeModal('modal-programar-viaje')" : '_pvAnterior()'}">
        ${_pv.paso === 1 ? 'Cancelar' : '← Anterior'}
      </button>
      <button class="btn-primary" style="flex:1" onclick="${_pv.paso === 3 ? '_pvGenerar()' : '_pvSiguiente()'}">
        ${_pv.paso === 3 ? '📄 Generar PDF' : 'Siguiente →'}
      </button>
    </div>`;
}

function _pvPaso1HTML() {
  const motivoHTML = _pv.fbId ? `
    <div class="form-group">
      <label>Motivo de la modificación *</label>
      <textarea id="pv-motivo" rows="2" placeholder="Ej: Condiciones climáticas adversas en el paso, demoras por fallas en máquinas..." maxlength="200" style="resize:vertical">${escHtml(_pv.motivoModificacion||'')}</textarea>
    </div>` : '';
  const versionBadge = _pv.fbId ? `<div style="display:inline-block;background:rgba(0,212,170,.15);color:var(--accent);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600;margin-bottom:12px">Versión ${(_pv.version||1)+1} — Reprogramación</div>` : '';
  return `${versionBadge}${motivoHTML}
    <div class="form-group">
      <label>Proyecto *</label>
      <input type="text" id="pv-proyecto" placeholder="Ej: Proyecto Escáneres DNM" maxlength="80" value="${escHtml(_pv.proyecto)}">
    </div>
    <div class="form-group">
      <label>Centro de costo *</label>
      <input type="text" id="pv-centro-costo" placeholder="Ej: Operaciones" maxlength="60" value="${escHtml(_pv.centroCosto)}">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label>Fecha inicio *</label>
        <input type="date" id="pv-fecha-inicio" value="${_pv.fechaInicio}">
      </div>
      <div class="form-group">
        <label>Fecha fin *</label>
        <input type="date" id="pv-fecha-fin" value="${_pv.fechaFin}">
      </div>
    </div>
    <div class="form-group">
      <label>Km estimados <span style="color:var(--text3);font-size:11px">(para combustible)</span></label>
      <input type="number" id="pv-km" placeholder="Ej: 2000" min="0" value="${_pv.kmEstimados}">
    </div>
    <div class="form-group">
      <label>Ciudad de origen <span style="color:var(--text3);font-size:11px">(punto de partida)</span></label>
      <input type="text" id="pv-ciudad-origen" placeholder="Ej: La Plata" maxlength="60" value="${escHtml(_pv.ciudadOrigen||'')}" oninput="_pv.ciudadOrigen=this.value;window._pv=_pv">
    </div>
    <div class="form-group">
      <label>Responsable de área <span style="color:var(--text3);font-size:11px">(va en copia del mail)</span></label>
      <input type="text" id="pv-responsable" placeholder="Ej: Ezequiel Lopez" maxlength="60" value="${escHtml(_pv.responsableArea)}">
    </div>`;
}

function _pvPaso2HTML() {
  const rows = _pv.viajeros.map((v, i) => `
    <div style="background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:10px;position:relative">
      ${i > 0 ? `<button onclick="_pvEliminarViajero(${i})" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:rgba(238,85,51,.6);font-size:16px;cursor:pointer">×</button>` : ''}
      <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px">VIAJERO ${i + 1}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <input type="text" placeholder="Nombre *" maxlength="40" value="${escHtml(v.nombre)}" oninput="_pv.viajeros[${i}].nombre=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
        <input type="text" placeholder="Apellido *" maxlength="40" value="${escHtml(v.apellido)}" oninput="_pv.viajeros[${i}].apellido=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input type="text" placeholder="DNI *" maxlength="12" value="${escHtml(v.dni)}" oninput="_pv.viajeros[${i}].dni=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
        <select oninput="_pv.viajeros[${i}].empresa=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
          <option value="Danaide" ${v.empresa==='Danaide'?'selected':''}>Danaide</option>
          <option value="Vialink" ${v.empresa==='Vialink'?'selected':''}>Vialink</option>
          <option value="Otra" ${v.empresa==='Otra'?'selected':''}>Otra</option>
        </select>
      </div>
    </div>`).join('');

  return `${rows}
    <button class="btn-ghost" style="width:100%;margin-top:4px" onclick="_pvAgregarViajero()">+ Agregar viajero</button>`;
}

function _pvPaso3HTML() {
  const checkBox = (id, label, checked) =>
    `<label style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;border:1px solid var(--border);cursor:pointer;margin-bottom:8px">
      <input type="checkbox" id="pv-srv-${id}" ${checked ? 'checked' : ''} onchange="_pv.servicios.${id}=this.checked;_pvActualizarVuelo()">
      <span style="font-size:13px">${label}</span>
    </label>`;

  const paradasHTML = _pv.paradas.map((p, i) => `
    <div style="background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:8px;position:relative">
      ${i > 0 ? `<button onclick="_pvEliminarParada(${i})" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:rgba(238,85,51,.6);font-size:16px;cursor:pointer">×</button>` : ''}
      <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px">PARADA ${i + 1}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <input type="text" placeholder="Ciudad *" maxlength="40" value="${escHtml(p.ciudad)}" oninput="_pv.paradas[${i}].ciudad=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
        <input type="text" placeholder="Provincia" maxlength="30" value="${escHtml(p.provincia)}" oninput="_pv.paradas[${i}].provincia=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input type="date" value="${p.fecha}" oninput="_pv.paradas[${i}].fecha=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
        <input type="number" placeholder="Noches" min="0" max="30" value="${p.noches}" oninput="_pv.paradas[${i}].noches=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px">
      </div>
    </div>`).join('');

  const franjaOpts = ['', 'De madrugada (00:00–06:00)', 'De mañana (06:00–12:00)', 'De tarde (12:00–19:00)', 'De noche (19:00–00:00)'];
  const franjaSelect = (id, val) => `<select id="${id}" onchange="_pv.${id.replace('pv-','').replace(/-/g,'_')}=this.value" style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-size:13px;width:100%">
    ${franjaOpts.map(o => `<option value="${o}" ${val===o?'selected':''}>${o||'— Seleccionar franja —'}</option>`).join('')}
  </select>`;

  return `
    <div style="font-size:13px;font-weight:600;color:var(--text3);margin-bottom:8px">SERVICIOS REQUERIDOS</div>
    ${checkBox('vehiculoPropio','🚗 Vehículo propio',_pv.servicios.vehiculoPropio)}
    ${checkBox('alquilerAuto','🔑 Alquiler de auto',_pv.servicios.alquilerAuto)}
    ${checkBox('vuelo','✈️ Vuelo',_pv.servicios.vuelo)}
    ${checkBox('hospedaje','🏨 Hospedaje',_pv.servicios.hospedaje)}
    ${checkBox('cochera','🅿️ Cochera',_pv.servicios.cochera)}

    <div id="pv-vuelo-franjas" style="display:${_pv.servicios.vuelo?'block':'none'};background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:12px">
      <div style="font-size:12px;font-weight:600;color:var(--text3);margin-bottom:8px">FRANJA HORARIA DE VUELO</div>
      <div style="margin-bottom:8px"><label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Salida</label>${franjaSelect('pv-franjaHorariaIda',_pv.franjaHorariaIda)}</div>
      <div><label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Regreso</label>${franjaSelect('pv-franjaHorariaVuelta',_pv.franjaHorariaVuelta)}</div>
    </div>

    <div style="font-size:13px;font-weight:600;color:var(--text3);margin:16px 0 8px">PARADAS DEL RECORRIDO</div>
    ${paradasHTML}
    <button class="btn-ghost" style="width:100%;margin-bottom:16px" onclick="_pvAgregarParada()">+ Agregar parada</button>

    <div class="form-group">
      <label>Link del recorrido <span style="color:var(--text3);font-size:11px">(Google Maps u otro)</span></label>
      <div style="display:flex;gap:8px">
        <input type="url" id="pv-url-recorrido" placeholder="https://maps.app.goo.gl/..." value="${escHtml(_pv.urlRecorrido)}" style="flex:1">
        <button class="btn-ghost" onclick="_pvGenerarUrlMaps()" style="flex-shrink:0;font-size:12px;padding:8px 10px">🗺️ Generar</button>
      </div>
    </div>

    <div class="form-group">
      <label>Observaciones</label>
      <textarea id="pv-observaciones" rows="3" placeholder="Ej: Incluir combustible teniendo en cuenta 2000 km aproximadamente." maxlength="400" style="resize:vertical">${escHtml(_pv.observaciones)}</textarea>
    </div>`;
}

window._pvActualizarVuelo = _pvActualizarVuelo;
function _pvActualizarVuelo() {
  const el = document.getElementById('pv-vuelo-franjas');
  if (el) el.style.display = _pv.servicios.vuelo ? 'block' : 'none';
}

function _pvAgregarViajero() {
  _pvGuardarPaso2();
  _pv.viajeros.push({ nombre: '', apellido: '', dni: '', empresa: 'Danaide' });
  _pvRenderPaso();
}
window._pvAgregarViajero = _pvAgregarViajero;

function _pvEliminarViajero(i) {
  _pvGuardarPaso2();
  _pv.viajeros.splice(i, 1);
  _pvRenderPaso();
}
window._pvEliminarViajero = _pvEliminarViajero;

function _pvAgregarParada() {
  _pvGuardarPaso3();
  _pv.paradas.push({ ciudad: '', provincia: '', noches: '', fecha: '' });
  _pvRenderPaso();
}
window._pvAgregarParada = _pvAgregarParada;

function _pvEliminarParada(i) {
  _pvGuardarPaso3();
  _pv.paradas.splice(i, 1);
  _pvRenderPaso();
}
window._pvEliminarParada = _pvEliminarParada;

function _pvGuardarPaso1() {
  _pv.proyecto            = document.getElementById('pv-proyecto')?.value.trim() || _pv.proyecto;
  _pv.centroCosto         = document.getElementById('pv-centro-costo')?.value.trim() || _pv.centroCosto;
  _pv.fechaInicio         = document.getElementById('pv-fecha-inicio')?.value || _pv.fechaInicio;
  _pv.fechaFin            = document.getElementById('pv-fecha-fin')?.value || _pv.fechaFin;
  _pv.kmEstimados         = document.getElementById('pv-km')?.value || _pv.kmEstimados;
  _pv.responsableArea     = document.getElementById('pv-responsable')?.value.trim() || _pv.responsableArea;
  _pv.ciudadOrigen        = document.getElementById('pv-ciudad-origen')?.value.trim() || _pv.ciudadOrigen || '';
  _pv.motivoModificacion  = document.getElementById('pv-motivo')?.value.trim() || _pv.motivoModificacion || '';
  window._pv = _pv;
}

function _pvGuardarPaso2() {
  // Los viajeros se guardan inline con oninput, nada extra que hacer
}

function _pvGuardarPaso3() {
  _pv.urlRecorrido   = document.getElementById('pv-url-recorrido')?.value.trim() || _pv.urlRecorrido;
  _pv.observaciones  = document.getElementById('pv-observaciones')?.value.trim() || _pv.observaciones;
  _pv.franjaHorariaIda    = document.getElementById('pv-franjaHorariaIda')?.value || _pv.franjaHorariaIda;
  _pv.franjaHorariaVuelta = document.getElementById('pv-franjaHorariaVuelta')?.value || _pv.franjaHorariaVuelta;
}

function _pvSiguiente() {
  if (_pv.paso === 1) {
    _pvGuardarPaso1();
    if (!_pv.proyecto || !_pv.centroCosto || !_pv.fechaInicio || !_pv.fechaFin) {
      showToast('Completá proyecto, centro de costo y fechas', 'error'); return;
    }
    if (_pv.fechaFin < _pv.fechaInicio) {
      showToast('La fecha de fin no puede ser anterior al inicio', 'error'); return;
    }
    if (_pv.fbId && !_pv.motivoModificacion) {
      showToast('Ingresá el motivo de la modificación', 'error'); return;
    }
  }
  if (_pv.paso === 2) {
    _pvGuardarPaso2();
    const invalido = _pv.viajeros.find(v => !v.nombre.trim() || !v.apellido.trim() || !v.dni.trim());
    if (invalido) { showToast('Completá nombre, apellido y DNI de cada viajero', 'error'); return; }
  }
  _pv.paso++;
  _pvRenderPaso();
}
window._pvSiguiente = _pvSiguiente;
window._pvRenderPaso = _pvRenderPaso;

function _pvAnterior() {
  if (_pv.paso === 2) _pvGuardarPaso2();
  if (_pv.paso === 3) _pvGuardarPaso3();
  _pv.paso--;
  _pvRenderPaso();
}
window._pvAnterior = _pvAnterior;

function _pvGenerarUrlMaps() {
  _pvGuardarPaso3();
  const paradas = _pv.paradas.filter(p => p.ciudad.trim());
  // Necesitamos al menos origen + 1 parada
  if (paradas.length < 1) { showToast('Agregá al menos una parada de destino', 'error'); return; }

  // Origen: ciudad del técnico (guardada en currentUser) o La Plata como default
  const ciudadOrigen = _pv.ciudadOrigen || currentUser?.ciudad || 'La Plata, Buenos Aires';
  const origenEnc = encodeURIComponent(ciudadOrigen + ', Argentina');

  // Cada parada va como segmento separado en la URL (no con |)
  // Formato correcto: /maps/dir/origen/parada1/parada2/destino
  const segmentos = paradas.map(p => {
    const lugar = p.ciudad + (p.provincia ? ', ' + p.provincia : '') + ', Argentina';
    return encodeURIComponent(lugar);
  });

  const url = `https://www.google.com/maps/dir/${origenEnc}/${segmentos.join('/')}`;
  _pv.urlRecorrido = url;
  const inp = document.getElementById('pv-url-recorrido');
  if (inp) inp.value = url;
  showToast('Recorrido generado desde ' + ciudadOrigen + ' — podés editarlo', 'success');
}
window._pvGenerarUrlMaps = _pvGenerarUrlMaps;

async function _pvGenerar() {
  _pvGuardarPaso3();

  // Validar paradas
  const paradasValidas = _pv.paradas.filter(p => p.ciudad.trim());
  if (paradasValidas.length === 0) { showToast('Agregá al menos una parada', 'error'); return; }

  showToast('Generando PDF...', 'success');

  try {
    const ahora = new Date().toISOString();

    if (_pv.fbId) {
      // ── Modificación de viaje existente ──────────────────────
      const versionAnterior = _pv.version || 1;
      const nuevaVersion = versionAnterior + 1;
      const historial = _pv.historialVersiones || [];
      historial.push({ version: versionAnterior, fecha: ahora, motivo: _pv.motivoModificacion || '' });
      const actualizado = {
        proyecto: _pv.proyecto, centroCosto: _pv.centroCosto,
        fechaInicio: _pv.fechaInicio, fechaFin: _pv.fechaFin,
        kmEstimados: _pv.kmEstimados, responsableArea: _pv.responsableArea,
        viajeros: _pv.viajeros, paradas: paradasValidas, servicios: _pv.servicios,
        franjaHorariaIda: _pv.franjaHorariaIda, franjaHorariaVuelta: _pv.franjaHorariaVuelta,
        urlRecorrido: _pv.urlRecorrido, observaciones: _pv.observaciones,
        version: nuevaVersion, historialVersiones: historial,
        ultimaModificacion: ahora, motivoModificacion: _pv.motivoModificacion || '',
      };
      // Actualizar en memoria siempre
      const idx = localViajes.findIndex(v => v.fbId === _pv.fbId);
      if (idx !== -1) localViajes[idx] = { ...localViajes[idx], ...actualizado };
      // Persistir offline
      _pvPersistirLocal();
      if (navigator.onLine) {
        try { await fbUpdateViaje(_pv.fbId, actualizado); }
        catch(e) {
          // Si falla online, encolar para reintentar
          queueAdd('programacion_update', { id: _pv.fbId, fbId: _pv.fbId, ...actualizado });
          showToast('Sin conexión — se sincronizará al reconectar', '');
        }
      } else {
        queueAdd('programacion_update', { id: _pv.fbId, fbId: _pv.fbId, ...actualizado });
        showToast('Sin conexión — se sincronizará al reconectar', '');
      }
      _pvGenerarPDF(paradasValidas, nuevaVersion);
    } else {
      // ── Viaje nuevo ──────────────────────────────────────────
      const localId = 'pv_' + Date.now();
      const registro = {
        id: localId,
        tipo: 'programacion',
        userId: currentUser.id,
        userName: currentUser.nombre || currentUser.email,
        proyecto: _pv.proyecto, centroCosto: _pv.centroCosto,
        fechaInicio: _pv.fechaInicio, fechaFin: _pv.fechaFin,
        // fechaSalida = fechaInicio para compatibilidad con índice de Firestore
        fechaSalida: _pv.fechaInicio ? _pv.fechaInicio + 'T00:00:00.000Z' : ahora,
        kmEstimados: _pv.kmEstimados, responsableArea: _pv.responsableArea,
        ciudadOrigen: _pv.ciudadOrigen || '',
        viajeros: _pv.viajeros, paradas: paradasValidas, servicios: _pv.servicios,
        franjaHorariaIda: _pv.franjaHorariaIda, franjaHorariaVuelta: _pv.franjaHorariaVuelta,
        urlRecorrido: _pv.urlRecorrido, observaciones: _pv.observaciones,
        fechaCreacion: ahora, estado: 'programado', version: 1, historialVersiones: [],
      };
      // Guardar en memoria siempre
      localViajes.push(registro);
      _pvPersistirLocal();
      if (navigator.onLine) {
        try {
          const fbId = await fbSaveViaje(registro);
          registro.fbId = fbId;
          const idx = localViajes.findIndex(v => v.id === localId);
          if (idx !== -1) localViajes[idx].fbId = fbId;
          _pvPersistirLocal();
        } catch(e) {
          queueAdd('programacion', registro);
          showToast('Sin conexión — se sincronizará al reconectar', '');
        }
      } else {
        queueAdd('programacion', registro);
        showToast('Sin conexión — se sincronizará al reconectar', '');
      }
      _pvGenerarPDF(paradasValidas, 1);
    }

    closeModal('modal-programar-viaje');
    renderViajes();
    renderViajesProgramados();
  } catch(e) {
    showToast('Error: ' + e.message, 'error');
  }
}
window._pvGenerar = _pvGenerar;

function _pvGenerarPDF(paradasValidas, version=1) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const M = 20; // margen izquierdo
  const W = 170; // ancho útil
  let y = 20;

  const fmtFecha = iso => {
    if (!iso) return '—';
    const [yy, mm, dd] = iso.split('-');
    return `${dd}/${mm}/${yy}`;
  };

  // ── Logo / Header ──
  try {
    doc.addImage(DANAIDE_LOGO, 'JPEG', M, y, 30, 12);
  } catch(e) {}
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Danaide Enterprise · v${version}`, 170, y + 4, { align: 'right' });
  doc.text('www.danaide.com.ar', 170, y + 8, { align: 'right' });
  y += 18;

  // ── Banner de reprogramación si aplica ──
  if (version > 1 && _pv.motivoModificacion) {
    doc.setFillColor(255, 243, 205);
    doc.roundedRect(M, y, W, 12, 2, 2, 'F');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 80, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Reprogramación v${version}:`, M + 3, y + 5);
    doc.setFont(undefined, 'normal');
    const motivoLines = doc.splitTextToSize(_pv.motivoModificacion, W - 40);
    doc.text(motivoLines, M + 35, y + 5);
    y += 16;
  }

  // ── Línea separadora ──
  doc.setDrawColor(0, 212, 170);
  doc.setLineWidth(0.8);
  doc.line(M, y, M + W, y);
  y += 8;

  // ── Título ──
  doc.setFontSize(14);
  doc.setTextColor(15, 32, 39);
  doc.setFont(undefined, 'bold');
  doc.text(`Solicitud de Viaje — ${_pv.proyecto}`, M, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} por ${currentUser.nombre || currentUser.email}`, M, y);
  y += 10;

  // ── Cuerpo tipo mail ──
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.setFont(undefined, 'normal');

  const linea = (txt, bold=false, indent=0) => {
    doc.setFont(undefined, bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(txt, W - indent);
    doc.text(lines, M + indent, y);
    y += lines.length * 5.5;
  };

  const espacio = (mm=4) => { y += mm; };

  linea('Buenos días, dejo el itinerario para gestionar hospedajes y viáticos.');
  espacio();

  // Servicios requeridos
  const srvLabels = [];
  if (_pv.servicios.hospedaje && _pv.servicios.cochera) srvLabels.push('Hospedaje con cochera');
  else if (_pv.servicios.hospedaje) srvLabels.push('Hospedaje');
  if (_pv.servicios.alquilerAuto) srvLabels.push('Alquiler de auto');
  if (_pv.servicios.vuelo) srvLabels.push('Vuelo');
  if (_pv.servicios.vehiculoPropio) srvLabels.push('Vehículo propio');

  // Solo mostrar paradas con hospedaje en el bloque de servicios
  const paradasConHotel = paradasValidas.filter(p => p.noches && parseInt(p.noches) > 0);

  if (srvLabels.length > 0) {
    linea(srvLabels.join(' · ') + ':', true);
    if ((_pv.servicios.hospedaje || _pv.servicios.cochera) && paradasConHotel.length > 0) {
      paradasConHotel.forEach(p => {
        const nochesStr = ` — ${p.noches} noche${parseInt(p.noches)>1?'s':''}`;
        const fechaStr = p.fecha ? ` ${fmtFecha(p.fecha)}` : '';
        linea(`${p.ciudad}${p.provincia ? ', '+p.provincia : ''}${nochesStr}${fechaStr}`, false, 4);
      });
    } else if (!_pv.servicios.hospedaje && !_pv.servicios.cochera) {
      // Sin hospedaje, no listar paradas en este bloque
    }
    espacio();
  }

  // Viáticos
  linea('Viáticos', true);
  linea(`Inicio: ${fmtFecha(_pv.fechaInicio)}`, false, 4);
  linea(`Finaliza: ${fmtFecha(_pv.fechaFin)}`, false, 4);
  espacio();

  // Viajeros
  linea(`Cant. de personas: ${_pv.viajeros.length}`, true);
  _pv.viajeros.forEach(v => {
    linea(`${v.nombre} ${v.apellido} (${v.empresa}) DNI ${v.dni}`, false, 4);
  });
  espacio();

  // Vuelo
  if (_pv.servicios.vuelo && (_pv.franjaHorariaIda || _pv.franjaHorariaVuelta)) {
    linea('Preferencia de vuelo', true);
    if (_pv.franjaHorariaIda) linea(`Salida: ${_pv.franjaHorariaIda}`, false, 4);
    if (_pv.franjaHorariaVuelta) linea(`Regreso: ${_pv.franjaHorariaVuelta}`, false, 4);
    espacio();
  }

  // Recorrido
  if (_pv.urlRecorrido) {
    linea('Recorrido a realizar', true);
    doc.setTextColor(0, 112, 240);
    const urlLines = doc.splitTextToSize(_pv.urlRecorrido, W - 4);
    doc.text(urlLines, M + 4, y);
    doc.link(M + 4, y - 4, W - 4, urlLines.length * 5.5, { url: _pv.urlRecorrido });
    y += urlLines.length * 5.5;
    doc.setTextColor(30);
    espacio();
  }

  // Km estimados
  if (_pv.kmEstimados) {
    linea(`Incluir combustible teniendo en cuenta ${Number(_pv.kmEstimados).toLocaleString('es-AR')} km aproximadamente.`);
    espacio();
  }

  // Observaciones
  if (_pv.observaciones) {
    linea(_pv.observaciones);
    espacio();
  }

  // Proyecto / Centro de costo
  linea(`Proyecto: ${_pv.proyecto}`, false);
  linea(`Centro de costo: ${_pv.centroCosto}`, false);
  espacio(6);

  // Aviso CC
  if (_pv.responsableArea) {
    doc.setDrawColor(220);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + W, y);
    y += 5;
    doc.setFontSize(8.5);
    doc.setTextColor(120);
    doc.setFont(undefined, 'bold');
    doc.text(`⚠ Recordá incluir en copia a: ${_pv.responsableArea}`, M, y);
    y += 4;
    doc.setFont(undefined, 'normal');
    doc.text('para verificación y autorización del viaje (requerido por política interna).', M, y);
    y += 8;
  }

  // Anticipación
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Las solicitudes deben enviarse con mínimo 48 hs hábiles de anticipación y dentro del horario de pagos (11:00–14:00 hs).', M, y, { maxWidth: W });

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(160);
    doc.text(`ScanCheck — Danaide Enterprise · Página ${i} de ${totalPages}`, M + W / 2, 290, { align: 'center' });
  }

  const fecha = localDateKey();
  const nombreArchivo = `Solicitud_Viaje_${_pv.proyecto.replace(/\s+/g,'-')}_v${version}_${fecha}.pdf`;
  doc.save(nombreArchivo);
  showToast('✓ PDF descargado', 'success');
}
window._pvGenerarPDF = _pvGenerarPDF;
// ── FIN PROGRAMAR VIAJE ───────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// ── VIAJES PROGRAMADOS — Lista y gestión ─────────────────────
// ══════════════════════════════════════════════════════════════

function renderViajesProgramados() {
  const el = document.getElementById('viajes-programados-list');
  if (!el) return;

  const fmtF = iso => iso ? new Date(iso+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
  const estadoCfg = {
    programado: { color:'#3b82f6', bg:'rgba(59,130,246,.12)', label:'Programado', icon:'🗓️' },
    'en curso':  { color:'#f59e0b', bg:'rgba(245,158,11,.12)', label:'En curso',  icon:'🚀' },
    completado:  { color:'#22c55e', bg:'rgba(34,197,94,.12)',  label:'Completado', icon:'✅' },
  };

  const mkCard = v => {
    const estado = v.estado || 'programado';
    const cfg = estadoCfg[estado] || estadoCfg.programado;
    const id = v.fbId || v.id;
    const paradas = (v.paradas||[]).map(p=>p.ciudad).filter(Boolean).join(' → ') || '—';
    const viajeros = (v.viajeros||[]).map(p=>`${p.nombre} ${p.apellido}`).join(', ') || '—';
    let botEstado = '';
    if (estado === 'programado')
      botEstado = `<button onclick="_pvIniciarDesdeListado('${id}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid rgba(245,158,11,.4);background:rgba(245,158,11,.1);color:#f59e0b;font-size:12px;font-weight:600;cursor:pointer">🚀 Iniciar</button>`;
    else if (estado === 'en curso')
      botEstado = `<button onclick="pvCompletarViajeProg('${id}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid rgba(34,197,94,.4);background:rgba(34,197,94,.1);color:#22c55e;font-size:12px;font-weight:600;cursor:pointer">✅ Completar</button>`;
    const botElim = `<button onclick="pvEliminarProgramado('${id}')" style="width:34px;padding:7px;border-radius:8px;border:1px solid rgba(238,85,51,.3);background:rgba(238,85,51,.08);color:#e55;font-size:13px;cursor:pointer;flex-shrink:0">🗑</button>`;
    const botEdit = estado !== 'completado' ? `<button onclick="pvEditarViaje('${id}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:12px;font-weight:600;cursor:pointer">✏️ Reprogramar</button>` : '';
    return `<div style="background:var(--bg2);border-radius:12px;padding:14px;margin-bottom:10px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(v.proyecto||'Sin proyecto')}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">${escHtml(v.centroCosto||'—')} · ${fmtF(v.fechaInicio)} – ${fmtF(v.fechaFin)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;padding-left:8px">
          <div style="background:${cfg.bg};color:${cfg.color};border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600">${cfg.icon} ${cfg.label}</div>
          <div style="font-size:10px;color:var(--text3)">v${v.version||1}</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:4px">📍 ${escHtml(paradas)}</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">👤 ${escHtml(viajeros)}</div>
      <div style="display:flex;gap:8px">${botEdit}${botEstado}${botElim}</div>
    </div>`;
  };

  // Activos en memoria (programado + en curso)
  const activos = localViajes
    .filter(v => v.tipo === 'programacion' && !v.eliminado && v.estado !== 'completado')
    .sort((a,b) => (a.fechaInicio||'').localeCompare(b.fechaInicio||''));

  const htmlActivos = activos.length > 0
    ? activos.map(mkCard).join('')
    : '<div class="empty-state" style="margin-bottom:8px"><p>Sin viajes activos</p></div>';

  // Completados: se cargan on-demand desde Firestore para no ocupar localStorage
  const secCompletados = `<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px;display:flex;justify-content:space-between;align-items:center">
    <span>Completados</span>
    <button id="btn-ver-completados" onclick="pvCargarCompletados()" style="font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text2);cursor:pointer">Ver</button>
  </div>
  <div id="viajes-completados-list"><div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div></div>`;

  el.innerHTML = htmlActivos + secCompletados;
}
window.renderViajesProgramados = renderViajesProgramados;

// Completa un viaje programado: cambia estado en Firestore y lo saca de localViajes
async function pvCompletarViajeProg(id) {
  const ahora = new Date().toISOString();
  // Actualizar en Firestore
  const v = localViajes.find(v => v.fbId === id || v.id === id);
  if (!v) return;
  if (navigator.onLine && (v.fbId && !v.fbId.startsWith('pv_'))) {
    try { await fbUpdateViaje(v.fbId, { estado: 'completado', ultimaModificacion: ahora }); }
    catch(e) { showToast('Error al completar: ' + e.message, 'error'); return; }
  }
  // Sacar de localViajes (ya está en Firestore, no ocupa más localStorage)
  const idx = localViajes.findIndex(v => v.fbId === id || v.id === id);
  if (idx !== -1) localViajes.splice(idx, 1);
  _pvPersistirLocal();
  renderViajesProgramados();
  showToast('✅ Viaje completado y archivado', 'success');
}
window.pvCompletarViajeProg = pvCompletarViajeProg;

// Carga los viajes completados desde Firestore on-demand (no se guardan en localStorage)
async function pvCargarCompletados() {
  const el = document.getElementById('viajes-completados-list');
  const btn = document.getElementById('btn-ver-completados');
  if (!el) return;

  // Toggle: si ya están cargados, ocultar
  if (el.dataset.cargado === '1') {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div>';
    el.dataset.cargado = '0';
    if (btn) btn.textContent = 'Ver';
    return;
  }

  el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:12px">Cargando...</div>';
  if (btn) btn.textContent = 'Ocultar';

  if (!navigator.onLine) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px">Sin conexión — los completados se sincronizan en línea</div>';
    if (btn) btn.textContent = 'Ver';
    return;
  }

  try {
    const todos = await fbGetMyViajes(currentUser.id);
    const completados = todos.filter(v =>
      v.tipo === 'programacion' && !v.eliminado && v.estado === 'completado'
    ).sort((a,b) => (b.ultimaModificacion||b.fechaFin||'').localeCompare(a.ultimaModificacion||a.fechaFin||''));

    if (completados.length === 0) {
      el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Sin viajes completados</div>';
      el.dataset.cargado = '1';
      return;
    }

    const fmtF = iso => iso ? new Date(iso+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
    el.innerHTML = completados.map(v => {
      const id = v.fbId || v.id;
      const paradas = (v.paradas||[]).map(p=>p.ciudad).filter(Boolean).join(' → ') || '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border);opacity:.85">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.proyecto||'—')}</div>
          <div style="color:#22c55e;font-size:10px;font-weight:600">✅ Completado</div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">${fmtF(v.fechaInicio)} – ${fmtF(v.fechaFin)} · v${v.version||1}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:8px">📍 ${escHtml(paradas)}</div>
        <button onclick="pvEliminarProgramado('${id}')" style="width:100%;padding:7px;border-radius:8px;border:1px solid rgba(238,85,51,.3);background:rgba(238,85,51,.06);color:#e55;font-size:12px;font-weight:600;cursor:pointer">🗑 Eliminar</button>
      </div>`;
    }).join('');
    el.dataset.cargado = '1';
  } catch(e) {
    el.innerHTML = `<div style="font-size:12px;color:#e55;text-align:center;padding:8px">Error: ${escHtml(e.message)}</div>`;
    if (btn) btn.textContent = 'Ver';
  }
}
window.pvCargarCompletados = pvCargarCompletados;

async function pvCambiarEstado(fbId, nuevoEstado) {
  // 'completado' tiene su propio flujo en pvCompletarViajeProg
  if (nuevoEstado === 'completado') { await pvCompletarViajeProg(fbId); return; }
  // Actualizar en memoria siempre
  const idx = localViajes.findIndex(v => v.fbId === fbId || v.id === fbId);
  const ahora = new Date().toISOString();
  if (idx !== -1) {
    localViajes[idx].estado = nuevoEstado;
    localViajes[idx].ultimaModificacion = ahora;
  }
  _pvPersistirLocal();
  renderViajesProgramados();
  showToast(`Viaje marcado como ${nuevoEstado}`, 'success');

  // Sincronizar con Firestore si hay conexión
  if (fbId && !fbId.startsWith('pv_')) {
    if (navigator.onLine) {
      try { await fbUpdateViaje(fbId, { estado: nuevoEstado, ultimaModificacion: ahora }); }
      catch(e) { queueAdd('programacion_estado', { id: fbId, fbId, estado: nuevoEstado, ultimaModificacion: ahora }); }
    } else {
      queueAdd('programacion_estado', { id: fbId, fbId, estado: nuevoEstado, ultimaModificacion: ahora });
    }
  } else if (fbId?.startsWith('pv_')) {
    queueAdd('programacion_estado', { id: fbId, fbId, estado: nuevoEstado, ultimaModificacion: ahora });
  }

  // Al pasar a "en curso": redirigir a la sección viajes y abrir iniciar viaje
  if (nuevoEstado === 'en curso') {
    const viaje = localViajes[idx];
    showPage('viajes');
    // Pequeña pausa para que la página cargue antes de abrir el modal
    setTimeout(() => showIniciarViaje(viaje), 400);
  }
}
window.pvCambiarEstado = pvCambiarEstado;

async function pvEliminarProgramado(fbId) {
  if (!confirm('¿Eliminar este viaje programado? Va a la papelera del supervisor.')) return;
  // Quitar de memoria y localStorage (desaparece de la vista del técnico)
  const idx = localViajes.findIndex(v => v.fbId === fbId || v.id === fbId);
  if (idx !== -1) localViajes.splice(idx, 1);
  _pvPersistirLocal();
  renderViajesProgramados();
  showToast('Viaje enviado a la papelera', 'success');
  // Soft-delete en Firestore (mismo patrón que el resto)
  if (!fbId || fbId.startsWith('pv_')) return; // sin fbId real, no hay nada en Firestore
  if (navigator.onLine) {
    try { await fbSoftDeleteViaje(fbId, currentUser?.id); }
    catch(e) { console.warn('Error en soft-delete Firestore:', e.message); }
  }
}
window.pvEliminarProgramado = pvEliminarProgramado;

function pvEditarViaje(fbId) {
  const viaje = localViajes.find(v => v.fbId === fbId);
  if (!viaje) { showToast('Viaje no encontrado', 'error'); return; }

  // Cargar datos del viaje en el estado del wizard
  window._pv = _pv = {
    paso: 1,
    fbId: viaje.fbId,
    version: viaje.version || 1,
    historialVersiones: viaje.historialVersiones || [],
    motivoModificacion: '',
    proyecto: viaje.proyecto || '',
    centroCosto: viaje.centroCosto || '',
    fechaInicio: viaje.fechaInicio || '',
    fechaFin: viaje.fechaFin || '',
    kmEstimados: viaje.kmEstimados || '',
    responsableArea: viaje.responsableArea || '',
    observaciones: viaje.observaciones || '',
    viajeros: JSON.parse(JSON.stringify(viaje.viajeros || [{ nombre:'', apellido:'', dni:'', empresa:'Danaide' }])),
    paradas: JSON.parse(JSON.stringify(viaje.paradas || [{ ciudad:'', provincia:'', noches:'', fecha:'' }])),
    servicios: { ...{ vehiculoPropio:false, alquilerAuto:false, vuelo:false, hospedaje:false, cochera:false }, ...(viaje.servicios||{}) },
    franjaHorariaIda: viaje.franjaHorariaIda || '',
    franjaHorariaVuelta: viaje.franjaHorariaVuelta || '',
    urlRecorrido: viaje.urlRecorrido || '',
    ciudadOrigen: viaje.ciudadOrigen || '',
  };

  document.getElementById('modal-programar-viaje').classList.remove('hidden');
  _pvRenderPaso();
}
window.pvEditarViaje = pvEditarViaje;

// ── FIN VIAJES PROGRAMADOS ────────────────────────────────────

async function calcularReporteService() {
  const fechaService = document.getElementById('inp-service-fecha')?.value;
  const kmService = parseInt(document.getElementById('inp-service-km')?.value);
  const kmActual = parseInt(document.getElementById('inp-service-km-actual')?.value);
  const titular = document.getElementById('inp-service-titular')?.value.trim();
  const vehiculo = document.getElementById('inp-service-vehiculo')?.value.trim();

  if (!fechaService || !kmService || !kmActual) { showToast('Completá todos los campos obligatorios','error'); return; }
  if (kmActual <= kmService) { showToast('El km actual debe ser mayor al km del service','error'); return; }

  // Guardar en Firestore (persiste aunque se limpie el caché) y localStorage como respaldo
  const serviceDataToSave = {fecha:fechaService, km:kmService, kmActual, titular, vehiculo};
  try { await fbSaveServiceData(currentUser.id, serviceDataToSave); } catch(e) {}
  try { localStorage.setItem('scancheck_service_'+currentUser.id, JSON.stringify(serviceDataToSave)); } catch(e) {}

  // fechaCorte solo se usa para el texto informativo del período
  const saved = window._serviceDataSaved || {};
  const fechaCorte = saved.fechaCorte || null;
  // Un tramo entra en el reporte si NO fue agrupado en un reporte anterior.
  // El marcador serviceReportId es la garantía: al guardar un reporte, cada tramo
  // usado queda marcado y ya no vuelve a sumarse. No filtramos por fecha para no
  // dejar afuera tramos nuevos que el técnico haya cargado con fecha atrasada.
  const viajesLaboral = localViajes.filter(v =>
    v.estado === 'cerrado' && !v.eliminado &&
    !v.serviceReportId &&
    v.kmRecorridos > 0
  );
  const esPrimerReporte = !fechaCorte;
  const kmLaborales = viajesLaboral.reduce((s,v) => s+(v.kmRecorridos||0), 0);
  const kmTotales = kmActual - kmService;
  const pct = kmTotales > 0 ? Math.round(kmLaborales/kmTotales*100) : 0;

  // Guardar datos calculados para la vista 2 y el guardado final
  window._serviceData = { fechaService, kmService, kmActual, kmTotales, kmLaborales, pct, titular, vehiculo, viajesLaboral, fechaCorte, esPrimerReporte };

  // ── VISTA 2: resumen con campos bloqueados, flecha atrás y botón Guardar ──
  const el = document.getElementById('modal-service-content');
  const fmtF = f => f ? new Date(f+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
  const campoRO = (label, valor) => `
    <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px;color:var(--text3)">${label}</span>
      <span style="font-size:12px;font-weight:600;color:var(--text)">${escHtml(String(valor||'—'))}</span>
    </div>`;

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <button onclick="volverFormService()" style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:16px;cursor:pointer;padding:4px 12px">←</button>
      <div style="font-size:16px;font-weight:700;color:var(--text)">🔧 Resumen del reporte</div>
    </div>

    <div style="background:var(--bg3);border-radius:10px;padding:12px;margin-bottom:12px">
      ${campoRO('Fecha último service', fmtF(fechaService))}
      ${campoRO('Km en el service', kmService.toLocaleString() + ' km')}
      ${campoRO('Km actuales', kmActual.toLocaleString() + ' km')}
      ${campoRO('Titular', titular)}
      ${campoRO('Vehículo', vehiculo)}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--accent)">${kmTotales.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text3)">Km totales recorridos</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--accent2)">${kmLaborales.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text3)">Km laborales</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--text)">${pct}%</div>
        <div style="font-size:10px;color:var(--text3)">Uso laboral</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--text)">${viajesLaboral.length}</div>
        <div style="font-size:10px;color:var(--text3)">Tramos incluidos</div>
      </div>
    </div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:12px">
      ${esPrimerReporte
        ? 'Período: desde ' + new Date(fechaService+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → hoy'
        : 'Período: desde el último reporte generado (' + new Date(fechaCorte).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ') → hoy'
      }
    </div>
    ${viajesLaboral.length === 0 ? '<div style="margin-bottom:12px;padding:8px;background:rgba(238,85,51,.1);border-radius:8px;font-size:12px;color:#e53;text-align:center">No hay tramos nuevos desde el último reporte — no se puede guardar</div>' : ''}
    <div style="display:flex;gap:10px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-service')">Cancelar</button>
      <button class="btn-primary" style="flex:1;${viajesLaboral.length===0?'opacity:.4;pointer-events:none':''}" onclick="guardarReporteService()">💾 Guardar</button>
    </div>`;
}
window.calcularReporteService = calcularReporteService;

// Flecha atrás: vuelve a la vista 1 con los campos precargados para corregir
function volverFormService() {
  showReporteService();
}
window.volverFormService = volverFormService;

// Guarda el reporte de service: crea el documento en Firestore con el snapshot
// de tramos, los marca como reportados (desaparecen del historial) y descarga el PDF.
async function guardarReporteService() {
  const d = window._serviceData;
  if (!d || !d.viajesLaboral || d.viajesLaboral.length === 0) return;

  if (!navigator.onLine) {
    showToast('Necesitás conexión para guardar el reporte de service', 'error');
    return;
  }

  showToast('Guardando reporte...', '');
  try {
    const ahora = new Date().toISOString();
    // Snapshot liviano de los tramos (sin fotos base64)
    const snapshot = d.viajesLaboral.map(v => ({
      fbId: v.fbId || v.id || '',
      destinoLabel: v.destinoLabel || '',
      fechaSalida: v.fechaSalida || '',
      fechaLlegada: v.fechaLlegada || '',
      kmSalida: v.kmSalida || 0,
      kmLlegada: v.kmLlegada || 0,
      kmRecorridos: v.kmRecorridos || 0,
      distanciaGPS: v.distanciaGPS || null,
      vehiculo: v.vehiculo || '',
    }));

    const reporte = {
      userId: currentUser.id,
      userName: currentUser.name || currentUser.email,
      fechaGeneracion: ahora,
      fechaService: d.fechaService,
      kmService: d.kmService,
      kmActual: d.kmActual,
      kmTotales: d.kmTotales,
      kmLaborales: d.kmLaborales,
      pct: d.pct,
      titular: d.titular || '',
      vehiculo: d.vehiculo || '',
      fechaCorteAnterior: d.fechaCorte || null,
      viajesSnapshot: snapshot,
      cantidadTramos: snapshot.length,
    };

    const reportId = await fbSaveServiceReport(reporte);
    reporte.fbId = reportId;

    // Marcar cada tramo con el ID del reporte (desaparecen del historial activo)
    for (const v of d.viajesLaboral) {
      if (v.fbId) {
        try { await fbUpdateViaje(v.fbId, { serviceReportId: reportId }); } catch(e) {}
      }
      const idx = localViajes.findIndex(x => x.fbId === v.fbId);
      if (idx !== -1) localViajes[idx].serviceReportId = reportId;
    }

    // Actualizar fechaCorte (compatibilidad con la lógica de períodos)
    try {
      const stored = JSON.parse(localStorage.getItem('scancheck_service_'+currentUser.id)||'{}');
      const updated = { ...stored, fechaCorte: ahora };
      await fbSaveServiceData(currentUser.id, updated);
      localStorage.setItem('scancheck_service_'+currentUser.id, JSON.stringify(updated));
    } catch(e) {}

    // Descargar el PDF automáticamente
    generarPDFService(d);

    closeModal('modal-service');
    renderViajes();
    renderServiceReports();
    showToast('✓ Reporte guardado — ' + snapshot.length + ' tramos agrupados', 'success');
  } catch(e) {
    showToast('Error al guardar: ' + e.message, 'error');
  }
}
window.guardarReporteService = guardarReporteService;

async function generarPDFService(dataParam) {
  const d = dataParam || window._serviceData;
  if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const M = 18, W = 210, CW = W-M*2;
  let y = 12;

  // Logo
  try { doc.addImage(DANAIDE_LOGO,'JPEG',M,y,38,14); } catch(e) {}

  // Título
  doc.setFontSize(16); doc.setFont(undefined,'bold');
  doc.setTextColor(0,212,170);
  doc.text('REPORTE DE KM LABORALES', W/2, y+8, {align:'center'});
  doc.setFontSize(10); doc.setFont(undefined,'normal');
  doc.setTextColor(120,140,160);
  doc.text('Para reimbursement proporcional de service vehicular', W/2, y+14, {align:'center'});
  y += 24;

  // Datos del técnico y vehículo
  doc.setFillColor(15,32,39); doc.roundedRect(M,y,CW,28,3,3,'F');
  doc.setFontSize(9); doc.setTextColor(200,220,230);
  doc.text('TÉCNICO', M+6, y+7);
  doc.setFont(undefined,'bold'); doc.setFontSize(12); doc.setTextColor(255,255,255);
  doc.text(d.titular||currentUser?.name||'—', M+6, y+14);
  doc.setFont(undefined,'normal'); doc.setFontSize(9); doc.setTextColor(180,200,220);
  doc.text(`Vehículo: ${d.vehiculo||'—'}`, M+6, y+21);
  const periodoLabel = d.fechaCorte
    ? 'Desde: ' + new Date(d.fechaCorte).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → ' + new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})
    : new Date(d.fechaService+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → ' + new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});
  doc.text('Período: ' + periodoLabel, M+6, y+27);
  y += 34;

  // Resumen
  doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('RESUMEN DEL PERÍODO', M, y); y += 6;
  const cols = [
    ['Km odómetro en el último service', d.kmService.toLocaleString()+' km'],
    ['Km odómetro actuales', d.kmActual.toLocaleString()+' km'],
    ['Total km recorridos en el período', d.kmTotales.toLocaleString()+' km'],
    ['Km recorridos por trabajo (ScanCheck)', d.kmLaborales.toLocaleString()+' km'],
    ['Porcentaje de uso laboral', d.pct+'%'],
  ];
  cols.forEach(([label, val], i) => {
    const bg = i%2===0 ? [20,40,55] : [15,32,39];
    doc.setFillColor(...bg); doc.rect(M, y, CW, 7, 'F');
    doc.setFontSize(9); doc.setFont(undefined,'normal'); doc.setTextColor(180,200,220);
    doc.text(label, M+4, y+5);
    doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
    doc.text(val, W-M-4, y+5, {align:'right'});
    y += 7;
  });
  y += 8;

  // Detalle de viajes
  doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('DETALLE DE VIAJES LABORALES', M, y); y += 6;

  // Header
  doc.setFillColor(0,212,170); doc.rect(M, y, CW, 7, 'F');
  doc.setFontSize(8); doc.setFont(undefined,'bold'); doc.setTextColor(10,22,40);
  doc.text('Fecha salida', M+3, y+5);
  doc.text('Destino', M+35, y+5);
  doc.text('Km salida', M+100, y+5);
  doc.text('Km llegada', M+125, y+5);
  doc.text('Km rec.', W-M-4, y+5, {align:'right'});
  y += 7;

  (d.viajesLaboral || d.viajesSnapshot || []).forEach((v,i) => {
    if (y > 265) { doc.addPage(); y = 20; }
    const bg = i%2===0 ? [20,40,55] : [15,32,39];
    doc.setFillColor(...bg); doc.rect(M, y, CW, 6, 'F');
    doc.setFontSize(7.5); doc.setFont(undefined,'normal'); doc.setTextColor(180,200,220);
    const fecha = new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'});
    doc.text(fecha, M+3, y+4);
    const dest = (v.destinoLabel||'—').substring(0,30);
    doc.text(dest, M+35, y+4);
    doc.text((v.kmSalida||0).toLocaleString(), M+100, y+4);
    doc.text((v.kmLlegada||0).toLocaleString(), M+125, y+4);
    doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
    doc.text((v.kmRecorridos||0).toLocaleString()+' km', W-M-4, y+4, {align:'right'});
    y += 6;
  });

  // Total
  y += 2;
  doc.setFillColor(0,80,60); doc.rect(M, y, CW, 8, 'F');
  doc.setFontSize(9); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('TOTAL KM LABORALES', M+4, y+5.5);
  doc.text(d.kmLaborales.toLocaleString()+' km', W-M-4, y+5.5, {align:'right'});
  y += 14;

  // Footer note
  doc.setFontSize(8); doc.setFont(undefined,'italic'); doc.setTextColor(100,120,140);
  const nota = `Este reporte fue generado automáticamente por ScanCheck (Danaide Enterprise) el ${new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})}. Los kilómetros laborales corresponden a viajes registrados en el sistema durante el período indicado.`;
  const notaLines = doc.splitTextToSize(nota, CW);
  doc.text(notaLines, M, y);

  doc.save(`Reporte_Service_${(d.titular||currentUser?.name||'Tecnico').replace(/\s+/g,'_')}_${new Date().toISOString().substring(0,10)}.pdf`);
}
window.generarPDFService = generarPDFService;

// ── REPORTES DE SERVICE GUARDADOS ─────────────────────────────
// Renderiza el encabezado de la sección; la lista se carga on-demand
// desde Firestore para no ocupar memoria en celulares de gama baja.
function renderServiceReports() {
  const el = document.getElementById('service-reports-list');
  if (!el) return;
  el.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px;display:flex;justify-content:space-between;align-items:center">
      <span>Reportes de service</span>
      <button id="btn-ver-service-reports" onclick="cargarServiceReports()" style="font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text2);cursor:pointer">Ver</button>
    </div>
    <div id="service-reports-content"><div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div></div>`;
}
window.renderServiceReports = renderServiceReports;

async function cargarServiceReports() {
  const el = document.getElementById('service-reports-content');
  const btn = document.getElementById('btn-ver-service-reports');
  if (!el) return;

  if (el.dataset.cargado === '1') {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Tocá "Ver" para cargar</div>';
    el.dataset.cargado = '0';
    if (btn) btn.textContent = 'Ver';
    return;
  }

  el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:12px">Cargando...</div>';
  if (btn) btn.textContent = 'Ocultar';

  if (!navigator.onLine) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px">Sin conexión — los reportes se cargan en línea</div>';
    if (btn) btn.textContent = 'Ver';
    return;
  }

  try {
    const reportes = (await fbGetMyServiceReports(currentUser.id)).filter(r => !r.eliminado);
    if (reportes.length === 0) {
      el.innerHTML = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px 0">Sin reportes de service guardados</div>';
      el.dataset.cargado = '1';
      return;
    }
    // Guardar en window para re-descarga de PDF y expandir tramos
    window._serviceReportsCache = {};
    el.innerHTML = reportes.map(r => {
      window._serviceReportsCache[r.fbId] = r;
      const fecha = r.fechaGeneracion ? new Date(r.fechaGeneracion).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">🔧 Reporte ${fecha}</div>
          <div style="font-size:12px;font-weight:700;color:var(--accent2)">${(r.kmLaborales||0).toLocaleString()} km lab.</div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">${escHtml(r.vehiculo||'—')} · ${r.pct||0}% uso laboral · ${r.cantidadTramos||0} tramos</div>
        <div id="sr-tramos-${r.fbId}" style="display:none;margin-top:8px;border-top:1px solid var(--border);padding-top:8px"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="toggleTramosServiceReport('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:12px;font-weight:600;cursor:pointer">👁 Ver tramos</button>
          <button onclick="descargarPDFServiceReport('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent2);color:#fff;font-size:12px;font-weight:600;cursor:pointer">📄 PDF</button>
          <button onclick="eliminarServiceReport('${r.fbId}')" style="width:34px;padding:7px;border-radius:8px;border:1px solid rgba(238,85,51,.3);background:rgba(238,85,51,.08);color:#e55;font-size:13px;cursor:pointer;flex-shrink:0">🗑</button>
        </div>
      </div>`;
    }).join('');
    el.dataset.cargado = '1';
  } catch(e) {
    el.innerHTML = `<div style="font-size:12px;color:#e55;text-align:center;padding:8px">Error: ${escHtml(e.message)}</div>`;
    if (btn) btn.textContent = 'Ver';
  }
}
window.cargarServiceReports = cargarServiceReports;

// Elimina un reporte de service (soft-delete → papelera del supervisor).
// Los tramos agrupados vuelven al historial de km para poder recalcularse.
async function eliminarServiceReport(fbId) {
  if (!confirm('¿Eliminar este reporte? Los tramos vuelven al historial de km y el reporte va a la papelera del supervisor.')) return;
  if (!navigator.onLine) { showToast('Necesitás conexión para eliminar el reporte', 'error'); return; }
  try {
    const r = window._serviceReportsCache?.[fbId];
    await fbSoftDeleteServiceReport(fbId, currentUser?.id);
    // Liberar los tramos: quitar serviceReportId para que vuelvan al historial
    const tramos = r?.viajesSnapshot || [];
    for (const t of tramos) {
      if (t.fbId) {
        try { await fbUpdateViaje(t.fbId, { serviceReportId: null }); } catch(e) {}
        const idx = localViajes.findIndex(v => v.fbId === t.fbId);
        if (idx !== -1) localViajes[idx].serviceReportId = null;
      }
    }
    renderViajes();
    // Refrescar lista de reportes
    const content = document.getElementById('service-reports-content');
    if (content) { content.dataset.cargado = '0'; cargarServiceReports(); }
    showToast('✓ Reporte eliminado — ' + tramos.length + ' tramos vuelven al historial', 'success');
  } catch(e) {
    showToast('Error: ' + e.message, 'error');
  }
}
window.eliminarServiceReport = eliminarServiceReport;

// ── Papelera de reportes de service (supervisor) ──
async function restaurarServiceReport(fbId) {
  try {
    // Verificar conflicto: si algún tramo ya fue agrupado en OTRO reporte nuevo,
    // avisar al supervisor antes de re-vincular.
    const todosDeleted = await fbGetDeletedServiceReports();
    const r = todosDeleted.find(x => x.fbId === fbId);
    if (!r) { showToast('Reporte no encontrado', 'error'); return; }

    await fbRestoreServiceReport(fbId);
    // Re-vincular los tramos al reporte restaurado
    let reVinculados = 0, conflictos = 0;
    for (const t of (r.viajesSnapshot || [])) {
      if (!t.fbId) continue;
      try {
        const local = localViajes.find(v => v.fbId === t.fbId);
        const yaEnOtro = local?.serviceReportId && local.serviceReportId !== fbId;
        if (yaEnOtro) { conflictos++; continue; }
        await fbUpdateViaje(t.fbId, { serviceReportId: fbId });
        const idx = localViajes.findIndex(v => v.fbId === t.fbId);
        if (idx !== -1) localViajes[idx].serviceReportId = fbId;
        reVinculados++;
      } catch(e) {}
    }
    renderViajes();
    showPapeleraViajes();
    showToast(`✓ Reporte restaurado — ${reVinculados} tramos re-agrupados${conflictos ? ` (${conflictos} ya estaban en otro reporte)` : ''}`, 'success');
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.restaurarServiceReport = restaurarServiceReport;

async function borrarServiceReportDefinitivo(fbId) {
  if (!confirm('¿Borrar este reporte DEFINITIVAMENTE? Esta acción no se puede deshacer.')) return;
  try {
    await fbHardDeleteServiceReport(fbId);
    showPapeleraViajes();
    showToast('Reporte borrado definitivamente', 'success');
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}
window.borrarServiceReportDefinitivo = borrarServiceReportDefinitivo;

function toggleTramosServiceReport(fbId) {
  const div = document.getElementById('sr-tramos-'+fbId);
  const r = window._serviceReportsCache?.[fbId];
  if (!div || !r) return;
  if (div.style.display === 'none') {
    div.innerHTML = (r.viajesSnapshot||[]).map(v => {
      const f = v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}) : '—';
      return `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px">
        <span style="color:var(--text3)">${f} · ${escHtml(v.destinoLabel||'—')}</span>
        <span style="color:var(--text2);font-weight:600">${(v.kmRecorridos||0).toLocaleString()} km</span>
      </div>`;
    }).join('') || '<div style="font-size:11px;color:var(--text3)">Sin tramos</div>';
    div.style.display = 'block';
  } else {
    div.style.display = 'none';
  }
}
window.toggleTramosServiceReport = toggleTramosServiceReport;

function descargarPDFServiceReport(fbId) {
  const r = window._serviceReportsCache?.[fbId];
  if (!r) return;
  generarPDFService(r);
}
window.descargarPDFServiceReport = descargarPDFServiceReport;

// ── Supervisor: reportes de service de todos los técnicos ──
async function loadSupServiceReports() {
  const el = document.getElementById('sup-viajes-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando reportes de service...</div>';
  try {
    const reportes = (await fbGetAllServiceReports()).filter(r => !r.eliminado);
    if (reportes.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>Sin reportes de service</p></div>';
      return;
    }
    window._serviceReportsCache = window._serviceReportsCache || {};
    el.innerHTML = reportes.map(r => {
      window._serviceReportsCache[r.fbId] = r;
      const fecha = r.fechaGeneracion ? new Date(r.fechaGeneracion).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(r.userName||'—')}</div>
          <div style="font-size:12px;font-weight:700;color:var(--accent2)">${(r.kmLaborales||0).toLocaleString()} km lab.</div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">Generado: ${fecha} · ${escHtml(r.vehiculo||'—')}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">Km totales: ${(r.kmTotales||0).toLocaleString()} · ${r.pct||0}% uso laboral · ${r.cantidadTramos||0} tramos</div>
        <div id="sr-tramos-${r.fbId}" style="display:none;margin-top:8px;border-top:1px solid var(--border);padding-top:8px"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="toggleTramosServiceReport('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:12px;font-weight:600;cursor:pointer">👁 Ver tramos</button>
          <button onclick="descargarPDFServiceReport('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent2);color:#fff;font-size:12px;font-weight:600;cursor:pointer">📄 PDF</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><p>Error: ${escHtml(e.message)}</p></div>`;
  }
}
window.loadSupServiceReports = loadSupServiceReports;

// ── VIAJES SUPERVISOR ─────────────────────────────────────────
async function loadSupViajes() {
  const el = document.getElementById('sup-viajes-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando...</div>';
  try {
    const viajes = await fbGetAllViajes();
    if (viajes.length === 0) { el.innerHTML = '<div class="empty-state"><p>Sin viajes registrados</p></div>'; return; }
    // Agrupar por técnico
    const byTech = {};
    viajes.filter(v=>v.estado==='cerrado').forEach(v => {
      const t = v.userName||'—';
      if (!byTech[t]) byTech[t] = { viajes:[], totalKm:0 };
      byTech[t].viajes.push(v);
      byTech[t].totalKm += v.kmRecorridos||0;
    });
    el.innerHTML = Object.keys(byTech).sort().map(tech => {
      const { viajes: tvs, totalKm } = byTech[tech];
      const rows = tvs.map(v => {
        const fechaSal = new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'});
        const fechaLleg = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'}) : '—';
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
          <div>
            <div style="font-weight:600;color:var(--text)">${escHtml(v.destinoLabel||'Sin destino')}</div>
            <div style="color:var(--text3)">${fechaSal} → ${fechaLleg} · Od: ${v.kmSalida?.toLocaleString()} → ${v.kmLlegada?.toLocaleString()}</div>
            ${v.distanciaGPS?`<div style="color:var(--text3)">GPS estimado: ~${v.distanciaGPS} km</div>`:''}
            <div style="display:flex;gap:8px;margin-top:6px">
              ${v.fotoOdometroSalida?`<div style="text-align:center"><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Salida</div><img src="${v.fotoOdometroSalida}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer" onclick="window.open('${v.fotoOdometroSalida}')"></div>`:''}
              ${v.fotoOdometroLlegada?`<div style="text-align:center"><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Llegada</div><img src="${v.fotoOdometroLlegada}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer" onclick="window.open('${v.fotoOdometroLlegada}')"></div>`:''}
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--accent);padding-left:12px">${(v.kmRecorridos||0).toLocaleString()} km</div>
        </div>
        <button onclick="mostrarMapaRecorrido(JSON.parse(this.dataset.v))" data-v="${escHtml(JSON.stringify(v))}"
          style="width:100%;margin-top:6px;padding:6px;border-radius:8px;border:1px solid var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer">
          🗺️ Ver recorrido
        </button>`;
      }).join('');
      return `<div style="background:var(--bg2);border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">👤 ${escHtml(tech)}</div>
          <div style="font-size:20px;font-weight:700;color:var(--accent)">${totalKm.toLocaleString()} km total</div>
        </div>
        ${rows}
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53">Error: ${e.message}</div>`;
  }
}
window.loadSupViajes = loadSupViajes;

async function eliminarViaje(fbId) {
  if (!confirm('¿Eliminar este viaje? Irá a la papelera del supervisor.')) return;
  try {
    await fbSoftDeleteViaje(fbId, currentUser?.id);
    localViajes = localViajes.filter(v => v.fbId !== fbId);
    if (viajeAbierto?.fbId === fbId) {
      viajeAbierto = null;
      try { localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id); } catch(e) {}
    }
    renderViajes();
    renderViajeAbiertoBanner();
    showToast('Viaje eliminado — visible en papelera del supervisor', 'success');
  } catch(e) { showToast('Error al eliminar: '+e.message, 'error'); }
}
window.eliminarViaje = eliminarViaje;

async function showPapeleraViajes() {
  const el = document.getElementById('papelera-viajes-content');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando...</div>';
  document.getElementById('modal-papelera-viajes').classList.remove('hidden');
  try {
    const [deleted, srDeleted] = await Promise.all([
      fbGetDeletedViajes(),
      fbGetDeletedServiceReports().catch(() => [])
    ]);
    if (deleted.length === 0 && srDeleted.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>La papelera está vacía</p></div>';
      return;
    }

    // Separar viajes de km de viajes programados
    const viajesKm = deleted.filter(v => v.tipo !== 'programacion');
    const programados = deleted.filter(v => v.tipo === 'programacion');

    const htmlKm = viajesKm.map(v => {
      const fecha = v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:4px">VIAJE KM</div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.userName||'—')} — ${escHtml(v.destinoLabel||'Sin destino')}</div>
        <div style="font-size:11px;color:var(--text3)">${fecha} · ${(v.kmRecorridos||0).toLocaleString()} km</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="restaurarViaje('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent);color:#0a1628;font-size:12px;font-weight:600;cursor:pointer">↩ Restaurar</button>
          <button onclick="borrarViajeDefinitivo('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:#e53;color:#fff;font-size:12px;font-weight:600;cursor:pointer">✕ Borrar definitivamente</button>
        </div>
      </div>`;
    }).join('');

    const htmlProg = programados.map(v => {
      const fmtF = iso => iso ? new Date(iso+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      const paradas = (v.paradas||[]).map(p=>p.ciudad).filter(Boolean).join(' → ') || '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;color:#3b82f6;margin-bottom:4px">VIAJE PROGRAMADO · v${v.version||1}</div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.proyecto||'Sin proyecto')}</div>
        <div style="font-size:11px;color:var(--text3)">${escHtml(v.userName||'—')} · ${fmtF(v.fechaInicio)} – ${fmtF(v.fechaFin)}</div>
        <div style="font-size:11px;color:var(--text3)">📍 ${escHtml(paradas)}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="restaurarViajeProgr('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent);color:#0a1628;font-size:12px;font-weight:600;cursor:pointer">↩ Restaurar</button>
          <button onclick="borrarViajeDefinitivo('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:#e53;color:#fff;font-size:12px;font-weight:600;cursor:pointer">✕ Borrar definitivamente</button>
        </div>
      </div>`;
    }).join('');

    const secKm = viajesKm.length > 0 ? `
      <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:4px 0 8px">Viajes de km (${viajesKm.length})</div>
      ${htmlKm}` : '';
    const secProg = programados.length > 0 ? `
      <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px">Viajes programados (${programados.length})</div>
      ${htmlProg}` : '';

    const htmlSR = srDeleted.map(r => {
      const fecha = r.fechaGeneracion ? new Date(r.fechaGeneracion).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;color:var(--accent2);margin-bottom:4px">REPORTE DE SERVICE</div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(r.userName||'—')} — ${fecha}</div>
        <div style="font-size:11px;color:var(--text3)">${escHtml(r.vehiculo||'—')} · ${(r.kmLaborales||0).toLocaleString()} km lab. · ${r.cantidadTramos||0} tramos</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="restaurarServiceReport('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent);color:#0a1628;font-size:12px;font-weight:600;cursor:pointer">↩ Restaurar</button>
          <button onclick="borrarServiceReportDefinitivo('${r.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:#e53;color:#fff;font-size:12px;font-weight:600;cursor:pointer">✕ Borrar definitivamente</button>
        </div>
      </div>`;
    }).join('');
    const secSR = srDeleted.length > 0 ? `
      <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px">Reportes de service (${srDeleted.length})</div>
      ${htmlSR}` : '';

    el.innerHTML = secKm + secProg + secSR;
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53">Error: ${e.message}</div>`;
  }
}
window.showPapeleraViajes = showPapeleraViajes;

async function restaurarViajeProgr(fbId) {
  try {
    await fbRestoreViaje(fbId);
    // Recargar en localViajes para que reaparezca en la vista del técnico
    const todos = await fbGetMyViajes(currentUser.id);
    localViajes = todos.filter(v => !v.eliminado);
    _pvPersistirLocal();
    renderViajesProgramados();
    showToast('Viaje programado restaurado', 'success');
    showPapeleraViajes();
    loadSupProgramados();
  } catch(e) { showToast('Error: '+e.message, 'error'); }
}
window.restaurarViajeProgr = restaurarViajeProgr;

async function restaurarViaje(fbId) {
  try {
    await fbRestoreViaje(fbId);
    showToast('Viaje restaurado', 'success');
    showPapeleraViajes();
    loadSupViajes();
  } catch(e) { showToast('Error: '+e.message, 'error'); }
}
window.restaurarViaje = restaurarViaje;

async function borrarViajeDefinitivo(fbId) {
  if (!confirm('¿Borrar definitivamente? Esta acción no se puede deshacer.')) return;
  try {
    await fbHardDeleteViaje(fbId);
    showToast('Viaje eliminado definitivamente', 'success');
    showPapeleraViajes();
  } catch(e) { showToast('Error: '+e.message, 'error'); }
}
window.borrarViajeDefinitivo = borrarViajeDefinitivo;

// ── EXPORT VIAJES A GOOGLE SHEETS ────────────────────────────
async function exportViajesSheets() {
  showToast('Exportando viajes a Sheets...', 'success');
  try {
    const viajes = await fbGetAllViajes();
    const cerrados = viajes.filter(v => !v.eliminado && v.estado === 'cerrado');
    if (cerrados.length === 0) { showToast('No hay viajes cerrados para exportar', 'error'); return; }

    // Para cada viaje, obtener los pasos y provincia de los scans asociados
    const rows = cerrados.map(v => {
      const fechaSalida = v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString('es-AR') : '';
      const fechaLlegada = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR') : '';
      // Buscar scans del técnico en el rango del viaje
      const salida = new Date(v.fechaSalida);
      const llegada = v.fechaLlegada ? new Date(v.fechaLlegada) : new Date();
      const scansViaje = localScans.filter(s =>
        s.userId === v.userId && s.lat && s.lon &&
        new Date(s.timestamp) >= salida && new Date(s.timestamp) <= llegada
      );
      const pasos = scansViaje.length > 0
        ? [...new Set(scansViaje.map(s => s.paso).filter(Boolean))].join(', ')
        : (v.destinoLabel || '');
      const provincia = scansViaje.length > 0
        ? [...new Set(scansViaje.map(s => s.address?.split(',').slice(-3,-2)[0]?.trim()).filter(Boolean))].join(', ')
        : '';
      return [
        fechaSalida,
        fechaLlegada,
        v.userName || '',
        v.vehiculo || '',
        v.destinoLabel || '',
        pasos,
        provincia,
        v.kmSalida || '',
        v.kmLlegada || '',
        v.kmRecorridos || '',
        v.distanciaGPS || ''
      ];
    });

    const headers = ['Fecha Salida','Fecha Llegada','Técnico','Vehículo','Destino','Pasos Visitados','Provincia','Km Salida','Km Llegada','Km Recorridos','Distancia GPS'];
    const values = [headers, ...rows];

    const token = await getGoogleAccessToken();
    // Clear and update Viajes sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Viajes!A:K:clear`, {
      method: 'POST', headers: { 'Authorization': 'Bearer '+token, 'Content-Type': 'application/json' }
    });
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Viajes!A1:K${values.length}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer '+token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values })
    });
    if (!res.ok) throw new Error('Error Sheets: '+(await res.text()).substring(0,100));
    showToast(`✓ ${rows.length} viajes exportados a Sheets`, 'success');
  } catch(e) { showToast('Error exportando: '+e.message, 'error'); }
}
window.exportViajesSheets = exportViajesSheets;

// ── MAPA DE RECORRIDO (OpenRouteService) ─────────────────────
async function mostrarMapaRecorrido(viaje) {
  // Obtener puntos GPS de los scans del día del viaje
  const fechaSalida = new Date(viaje.fechaSalida);
  const fechaLlegada = viaje.fechaLlegada ? new Date(viaje.fechaLlegada) : new Date();
  let scansDelDia = [];
  try {
    // Buscar todos los scans del técnico entre la fecha de salida y llegada
    scansDelDia = localScans.filter(s => {
      if (s.userId !== viaje.userId || !s.lat || !s.lon) return false;
      const ts = new Date(s.timestamp);
      return ts >= fechaSalida && ts <= fechaLlegada;
    });
  } catch(e) {}

  // Verificar que haya al menos 2 puntos GPS (scans + salida/llegada del viaje)
  const totalPuntos = scansDelDia.length +
    (viaje.latSalida ? 1 : 0) +
    (viaje.latLlegada ? 1 : 0);
  if (totalPuntos < 2) {
    showToast('Se necesitan al menos 2 puntos GPS para trazar el recorrido','error');
    return;
  }

  // Armar array de puntos GPS: salida → scans → llegada
  const puntosGPS = [];
  if (viaje.latSalida && viaje.lonSalida) {
    puntosGPS.push({ lat: viaje.latSalida, lon: viaje.lonSalida, timestamp: viaje.fechaSalida, paso: '📍 Punto de salida', puesto: '', esPuntoViaje: true });
  }
  scansDelDia.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  puntosGPS.push(...scansDelDia);
  if (viaje.latLlegada && viaje.lonLlegada) {
    puntosGPS.push({ lat: viaje.latLlegada, lon: viaje.lonLlegada, timestamp: viaje.fechaLlegada, paso: '🏁 Punto de llegada', puesto: '', esPuntoViaje: true });
  }
  const todosLosPuntos = puntosGPS.length >= 2 ? puntosGPS : scansDelDia;
  const coords = todosLosPuntos.map(s => [s.lon, s.lat]); // ORS usa [lon, lat]

  // Mostrar modal con mapa
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;flex-direction:column;padding:16px';
  modal.id = 'modal-mapa-recorrido';
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:15px;font-weight:700;color:#fff">🗺️ Recorrido — ${escHtml(viaje.destinoLabel||'Sin destino')}</div>
      <button onclick="document.getElementById('modal-mapa-recorrido').remove()" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;font-size:14px;cursor:pointer">✕ Cerrar</button>
    </div>
    <div id="mapa-recorrido" style="flex:1;border-radius:12px;overflow:hidden;min-height:300px"></div>
    <div id="mapa-recorrido-info" style="color:#fff;font-size:12px;text-align:center;padding:8px">Calculando ruta...</div>
  `;
  document.body.appendChild(modal);

  // Init Leaflet map
  await new Promise(r => setTimeout(r, 100));
  const map = L.map('mapa-recorrido');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Agregar marcadores de cada paso (incluyendo salida y llegada)
  todosLosPuntos.forEach((s, i) => {
    const color = i === 0 ? '#00d4aa' : i === scansDelDia.length-1 ? '#ff5555' : '#1a6fbd';
    const icon = L.divIcon({
      html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">${i+1}</div>`,
      iconSize: [28,28], iconAnchor: [14,14], className: ''
    });
    L.marker([s.lat, s.lon], {icon})
      .addTo(map)
      .bindPopup(`<strong>${escHtml(s.paso||'Paso '+i)}</strong><br>${escHtml(s.puesto||'')}<br><small>${new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</small>`);
  });

  // Llamar a OpenRouteService para obtener la ruta real por carreteras
  try {
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates: coords })
    });
    if (!res.ok) throw new Error('ORS error ' + res.status);
    const data = await res.json();
    const route = data.features?.[0];
    if (route) {
      // Dibujar la ruta en el mapa
      L.geoJSON(route, {
        style: { color: '#1a6fbd', weight: 4, opacity: 0.85 }
      }).addTo(map);
      // Ajustar vista al recorrido
      const bounds = L.geoJSON(route).getBounds();
      map.fitBounds(bounds, { padding: [20,20] });
      // Mostrar distancia real
      const distKm = (route.properties?.summary?.distance / 1000).toFixed(1);
      const durMin = Math.round(route.properties?.summary?.duration / 60);
      document.getElementById('mapa-recorrido-info').innerHTML =
        `📍 ${scansDelDia.length} pasos visitados · 🛣️ ${distKm} km por ruta · ⏱️ ~${durMin} min de conducción`;
    }
  } catch(e) {
    // Fallback: línea recta entre puntos
    const latlngs = scansDelDia.map(s => [s.lat, s.lon]);
    L.polyline(latlngs, { color: '#1a6fbd', weight: 3, dashArray: '8,6' }).addTo(map);
    map.fitBounds(L.polyline(latlngs).getBounds(), { padding: [20,20] });
    document.getElementById('mapa-recorrido-info').innerHTML =
      `📍 ${scansDelDia.length} pasos visitados · ⚠️ Ruta aproximada (sin conexión a ORS)`;
  }
}
window.mostrarMapaRecorrido = mostrarMapaRecorrido;

// Extrae el valor del odómetro de una foto usando Claude API (vision)
async function extraerKmDesdefoto(dataUrl) {
  try {
    const base64 = dataUrl.split(',')[1];
    const mediaType = dataUrl.split(';')[0].split(':')[1] || 'image/jpeg';
    console.log('[Odómetro] Enviando foto a Claude, mediaType:', mediaType, 'base64 length:', base64?.length);
    const res = await fetch(CLAUDE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-ScanCheck-Token': PHOTOS_TOKEN },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Esta es una foto del odómetro de un vehículo. Extraé SOLO el número de kilómetros que se ve en el display (sin puntos, sin comas, solo el número entero). Si no podés leerlo claramente, respondé "ERROR". Respondé ÚNICAMENTE con el número, sin texto adicional.' }
          ]
        }]
      })
    });
    console.log('[Odómetro] HTTP status:', res.status);
    const data = await res.json();
    console.log('[Odómetro] Respuesta Claude:', JSON.stringify(data).substring(0, 200));
    if (!res.ok) return null;
    const text = data.content?.[0]?.text?.trim();
    console.log('[Odómetro] Texto extraído:', text);
    if (!text || text === 'ERROR') return null;
    const num = parseInt(text.replace(/[^0-9]/g,''));
    return isNaN(num) ? null : num;
  } catch(e) {
    console.error('[Odómetro] Error:', e.message);
    return null;
  }
}

function previewFotoOdometro(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!input.files?.[0]) return;
  const reader = new FileReader();
  reader.onload = async e => {
    preview.src = e.target.result;
    preview.style.display = 'block';
    // Determinar qué campo de km llenar según el preview
    const kmFieldId = previewId === 'preview-odo-salida' ? 'inp-km-salida' : 'inp-km-llegada';
    const kmField = document.getElementById(kmFieldId);
    if (kmField) {
      kmField.placeholder = '⏳ Leyendo odómetro...';
      kmField.disabled = true;
      const km = await extraerKmDesdefoto(e.target.result);
      kmField.disabled = false;
      if (km) {
        kmField.value = km;
        kmField.style.borderColor = 'var(--accent)';
        showToast(`✓ Odómetro leído: ${km.toLocaleString()} km`, 'success');
        // Disparar evento input para actualizar el preview de diferencia (en cierre)
        kmField.dispatchEvent(new Event('input'));
      } else {
        kmField.placeholder = 'No se pudo leer — ingresá manualmente';
      }
    }
  };
  reader.readAsDataURL(input.files[0]);
}
window.previewFotoOdometro = previewFotoOdometro;

// ── Vista de registros sin informe ──────────────────────────
function showOrphanScans() {
  const orphans = getOrphanScans();
  const el = document.getElementById('orphan-list-content');
  if (!el) return;

  if (orphans.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text3);font-size:14px">
      ✅ Todos los registros tienen informe cerrado
    </div>`;
  } else {
    // Agrupar por fecha para mejor visualización
    const byDate = {};
    orphans.forEach(s => {
      const fecha = localDateKey(s.timestamp);
      if (!byDate[fecha]) byDate[fecha] = [];
      byDate[fecha].push(s);
    });
    const today = getTodayKey();
    el.innerHTML = Object.keys(byDate).sort((a,b) => b.localeCompare(a)).map(fecha => {
      const label = fecha === today ? 'Hoy' : new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long'});
      const items = byDate[fecha].map(s => `
        <div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(s.paso||'Sin paso')} — ${escHtml(s.puesto||'Sin puesto')}</div>
              <div style="font-size:11px;color:var(--text3)">${opLabel(s.opType)} · ${new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</div>
              ${s.scannerSerie ? `<div style="font-size:11px;color:var(--text2);margin-top:2px">Scanner: ${escHtml(s.scannerSerie)}</div>` : ''}
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button onclick="closeModal('modal-orphans');editScan('${s.id||s.fbId}')" 
                style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer">✏️ Editar</button>
              <button onclick="deleteOrphanScan('${s.id||s.fbId}')" 
                style="background:var(--danger,#e53);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer">🗑</button>
            </div>
          </div>
          ${s.notas ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">${escHtml(s.notas.substring(0,80))}${s.notas.length>80?'…':''}</div>` : ''}
        </div>`).join('');
      return `<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">${label}</div>${items}`;
    }).join('');
  }

  document.getElementById('modal-orphans').classList.remove('hidden');
}
window.showOrphanScans = showOrphanScans;

async function deleteOrphanScan(id) {
  if (!confirm('¿Eliminar este registro? Pasará a la papelera del supervisor.')) return;
  const scan = localScans.find(s => s.id===id || s.fbId===id);
  if (!scan) return;
  // Soft delete
  if (scan.fbId) {
    try { await fbSoftDeleteScan(scan.fbId, currentUser?.id); } catch(e) {}
  }
  localScans = localScans.filter(s => s.id!==id && s.fbId!==id);
  try {
    const scansForStorage = localScans.map(({photos,...s})=>({...s,photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats();
  showOrphanScans(); // refresh the list
  showToast('Registro eliminado — visible en papelera del supervisor','success');
}
window.deleteOrphanScan = deleteOrphanScan;

function showNextPendingReport() {
  if (pendingReportQueue.length === 0) { pendingReportTotal = 0; showPage('home'); return; }
  const { paso, scans, fecha } = pendingReportQueue[0];
  const posicionActual = pendingReportTotal - pendingReportQueue.length + 1;
  currentReport = { date: fecha, scanIds: scans.map(s=>s.id||s.fbId), paso };
  renderReportPage(scans, fecha, paso, posicionActual, pendingReportTotal);
  showPage('report');
}

function renderReportPage(scans, dateKey, paso, posicionActual, totalEnCola) {
  const d     = new Date(dateKey+'T12:00:00');
  const label = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const progresoLabel = totalEnCola > 1 ? ` · Informe ${posicionActual} de ${totalEnCola}` : '';
  document.getElementById('report-date-label').textContent = label.charAt(0).toUpperCase()+label.slice(1) + (paso ? ` — ${paso}` : '') + progresoLabel;
  document.getElementById('report-count-label').textContent = contarDispositivos(scans);
  if (totalEnCola > 1 && posicionActual === 1) {
    showToast(`Se generarán ${totalEnCola} informes pendientes`, 'success');
  }
  document.getElementById('inp-inspector-name').value = '';
  const jiraTicketInput = document.getElementById('inp-jira-ticket-numero');
  if (jiraTicketInput) jiraTicketInput.value = '';
  document.getElementById('report-scan-list').innerHTML = scans.map((s,i)=>{
    const photos=(s.photos||[]);
    const strip=photos.length>0
      ?`<div class="report-photos-strip">${photos.map(p=>`<img src="${p}" alt="foto">`).join('')}</div>`
      :`<div style="height:50px;display:flex;align-items:center;justify-content:center;background:var(--bg3);color:var(--text3);font-size:12px">Sin fotos</div>`;
    return `<div class="report-item">
      <div class="report-item-header">
        <div class="report-item-num">${i+1}</div>
        <div class="report-item-title"><strong>${escHtml(s.paso||'—')}</strong>
          <small>Puesto ${escHtml(s.puesto||'—')} · Serie ${escHtml(s.serie||'—')}</small>
        </div>
        <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span>
      </div>
      ${strip}

      ${bloqueEquipoInformeHtml(s, 'padding:8px 14px 4px', 'report-item-fields')}

      ${(s.producto && s.producto!=='scanner') ? `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">📍 Ubicación</div>
      <div class="report-item-fields">
        ${fTag('Hora',new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
        ${s.jiraTicket?fTagHtml('Jira',jiraTicketLink(s.jiraTicket)):''}
        ${fTag('GPS',s.lat?`${s.lat.toFixed(5)},${s.lon.toFixed(5)}`:'—')}
        ${s.address?fTag('Dirección',s.address):''}
      </div>
      <div style="padding:0 14px">${notasListHtml(s.notas)}</div>` : `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">💻 PC</div>
      <div class="report-item-fields">
        ${s.pcNombre?fTag('Nombre PC',s.pcNombre):''} ${fTag('Serie PC',s.serie)}
        ${fTag('Hora',new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
        ${s.jiraTicket?fTagHtml('Jira',jiraTicketLink(s.jiraTicket)):''}
        ${fTag('GPS',s.lat?`${s.lat.toFixed(5)},${s.lon.toFixed(5)}`:'—')}
        ${s.address?fTag('Dirección',s.address):''}
      </div>
      <div style="padding:0 14px">
        ${datosSistemaHtml(s.datosSistema)}
        ${notasListHtml(s.notas)}
      </div>`}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">✅ Checklists</div>
      <div style="padding:0 14px">
        ${s.checklistItems?checklistItemsHtml(s.checklistItems):(s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist))}
        ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
        ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      </div>
      ${s.opType==='reemplazo'?`<div style="padding:8px 14px"><button class="btn-secondary" style="width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button></div>`:''}
    </div>`;
  }).join('');
  sigHasDraw=false;
  if(sigCtx) sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height);
  document.getElementById('sig-hint').classList.remove('hidden');
}

// ======== SIGNATURE ========
function initSignatureCanvas() {
  sigCanvas=document.getElementById('sig-canvas');
  sigCtx=sigCanvas.getContext('2d');
  const getPos=e=>{ const r=sigCanvas.getBoundingClientRect(),sx=sigCanvas.width/r.width,sy=sigCanvas.height/r.height,src=e.touches?e.touches[0]:e; return{x:(src.clientX-r.left)*sx,y:(src.clientY-r.top)*sy}; };
  const start=e=>{ e.preventDefault();sigDrawing=true;const p=getPos(e);sigCtx.beginPath();sigCtx.moveTo(p.x,p.y);if(!sigHasDraw){sigHasDraw=true;document.getElementById('sig-hint').classList.add('hidden');} };
  const move=e=>{ e.preventDefault();if(!sigDrawing)return;const p=getPos(e);sigCtx.lineTo(p.x,p.y);sigCtx.strokeStyle='#00d4aa';sigCtx.lineWidth=2.5;sigCtx.lineCap='round';sigCtx.lineJoin='round';sigCtx.stroke(); };
  const end=e=>{ e.preventDefault();sigDrawing=false;sigCtx.beginPath(); };
  sigCanvas.addEventListener('mousedown',start);sigCanvas.addEventListener('mousemove',move);sigCanvas.addEventListener('mouseup',end);
  sigCanvas.addEventListener('touchstart',start,{passive:false});sigCanvas.addEventListener('touchmove',move,{passive:false});sigCanvas.addEventListener('touchend',end,{passive:false});
}
function clearSignature() { sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height);sigHasDraw=false;document.getElementById('sig-hint').classList.remove('hidden'); }
window.clearSignature = clearSignature;

async function saveReport() {
  if (!sigHasDraw) { showToast('Por favor firmá el informe','error'); return; }
  const inspectorName=document.getElementById('inp-inspector-name').value.trim();
  if (!inspectorName) { showToast('Ingresá el nombre del inspector','error'); return; }

  // Construir el N° de ticket completo desde el campo numérico (DND- + número)
  const ticketNumero = (document.getElementById('inp-jira-ticket-numero')?.value||'').trim();
  const jiraTicketPadreExistente = ticketNumero ? `DND-${ticketNumero}` : null;

  // Si no se ingresó número de ticket, pedir confirmación antes de continuar
  if (!jiraTicketPadreExistente) {
    const confirmar = await new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
        <div style="font-size:20px;margin-bottom:12px;text-align:center">🎫</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px;text-align:center">N° de ticket no completado</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:20px;text-align:center;line-height:1.4">No ingresaste un número de ticket de Jira existente.<br>¿Querés crear un ticket nuevo automáticamente?</div>
        <div style="display:flex;gap:10px">
          <button id="modal-ticket-cancelar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Cancelar</button>
          <button id="modal-ticket-confirmar" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer">Crear nuevo</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById('modal-ticket-cancelar').onclick = () => { document.body.removeChild(modal); resolve(false); };
      document.getElementById('modal-ticket-confirmar').onclick = () => { document.body.removeChild(modal); resolve(true); };
    });
    if (!confirmar) return; // el técnico canceló — vuelve a la pantalla para ingresar el número
  }

  if (!currentReport) return;

  // Embed full scan data in report (photos stored separately)
  const todayScans = localScans.filter(s => currentReport.scanIds.includes(s.id||s.fbId));
  const scansSnapshot = todayScans.map(s => ({
    id: s.id, fbId: s.fbId,
    producto: s.producto || 'scanner',
    paso: s.paso, puesto: s.puesto, serie: s.serie,
    serieRetira: s.serieRetira, serieNuevo: s.serieNuevo,
    pcNombre: s.pcNombre, scannerSerie: s.scannerSerie, scannerModelo: s.scannerModelo, scannerEstado: s.scannerEstado, invDnd: s.invDnd, invDnm: s.invDnm, checklist: s.checklist, checklistInstalacion: s.checklistInstalacion, actaReemplazo: s.actaReemplazo, fallaReparable: s.fallaReparable, instalacionReemplazoData: s.instalacionReemplazoData,
    // Campos específicos de Tótem
    serieMiniPC: s.serieMiniPC, modeloMiniPC: s.modeloMiniPC, ipMiniPC: s.ipMiniPC, macMiniPC: s.macMiniPC,
    serieCamara: s.serieCamara, modeloCamara: s.modeloCamara, seriePantalla: s.seriePantalla, modeloPantalla: s.modeloPantalla,
    equipoReemplazado: s.equipoReemplazado, mmRetira: s.mmRetira, mmNuevo: s.mmNuevo,
    estadoMiniPC: s.estadoMiniPC || null,
    // Campos específicos de Tablet
    deviceId: s.deviceId, ip: s.ip, mac: s.mac, deviceIdRetira: s.deviceIdRetira, deviceIdNuevo: s.deviceIdNuevo,
    // Checklist autodescriptivo (tótem/tablet)
    checklistItems: s.checklistItems || null,
    assureEngine: s.assureEngine, assureDocLib: s.assureDocLib, assureLicKey: s.assureLicKey, jiraTicket: s.jiraTicket,
    datosSistema: s.datosSistema || null,
    opType: s.opType, notas: s.notas,
    lat: s.lat, lon: s.lon, address: s.address,
    timestamp: s.timestamp, userId: s.userId, userName: s.userName,
    photos: s.photos || [],
    pcData: s.pcData
  }));

  const report = {
    id: 'rep_'+Date.now(),
    date: currentReport.date,
    scanIds: currentReport.scanIds,
    scansSnapshot,
    signature: sigCanvas.toDataURL('image/png'),
    inspectorName,
    technicianName: currentUser.name,
    technicianEmail: currentUser.email,
    userId: currentUser.id,
    jiraTicketExistente: jiraTicketPadreExistente, // N° de ticket padre preexistente (si lo ingresó el técnico)
    createdAt: new Date().toISOString()
  };

  localReports.unshift(report);
  // Persist reports to localStorage (without photos in snapshot)
  try {
    const repsForStorage = localReports.map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...s})=>({...s}))
    }));
    localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(repsForStorage));
  } catch(e) {}

  showToast('✓ Informe guardado','success');
  currentReport=null;

  // Si quedan más Pasos/días pendientes en esta tanda, continuar automáticamente con el siguiente informe
  pendingReportQueue.shift();
  if (pendingReportQueue.length > 0) {
    showNextPendingReport();
  } else {
    pendingReportTotal = 0;
    showPage('history');
  }

  // Save to Firebase (or queue if offline)
  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      const repFb = {
        ...report,
        scansSnapshot: (report.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
      };
      const fbId = await fbSaveReport(repFb);
      const ri = localReports.findIndex(r=>r.id===report.id);
      if (ri>=0) localReports[ri].fbId = fbId;
      setSyncStatus('ok');
    } catch(e) {
      setSyncStatus('error');
      queueAdd('report', report);
      showToast('Guardado local. Se sincronizará al reconectar','');
    }
  } else {
    queueAdd('report', report);
    setSyncStatus('offline');
  }
}
window.saveReport = saveReport;

// ======== HISTORY ========
function renderHistory() {
  const container=document.getElementById('history-list');
  if (!localReports.length) {
    container.innerHTML=`<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>Sin informes guardados</p></div>`;
    return;
  }
  const unsynced = localReports.filter(r => !r.fbId);
  const syncBanner = unsynced.length > 0 ? `
    <div style="background:rgba(0,174,255,.1);border:1px solid rgba(0,174,255,.25);border-radius:10px;padding:12px 14px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px">
      <div style="font-size:12px;color:var(--accent2)">${unsynced.length} informe${unsynced.length!==1?'s':''} pendiente${unsynced.length!==1?'s':''} de sincronizar</div>
      <button onclick="syncAllReports()" style="background:var(--accent2);color:#0a1628;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">Sincronizar</button>
    </div>` : '';
  // Orden cronológico: más reciente primero
  const sortedReports = [...localReports].sort((a,b) => {
    const ta = a.createdAt?.seconds ? a.createdAt.seconds*1000 : new Date((a.date||'1970-01-01')+'T12:00:00').getTime();
    const tb = b.createdAt?.seconds ? b.createdAt.seconds*1000 : new Date((b.date||'1970-01-01')+'T12:00:00').getTime();
    return tb - ta;
  });
  const renderRepCard = (rep) => {
    const d=new Date(rep.date+'T12:00:00');
    const label=d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    const count=rep.scanIds.length;
    const paso = rep.paso || rep.scansSnapshot?.[0]?.paso || '';
    const opType = rep.scansSnapshot?.[0]?.opType || '';
    const opBadge = opType ? `<span class="op-badge ${opType}" style="font-size:10px;padding:1px 7px;margin-left:6px">${opLabel(opType)}</span>` : '';
    const jiraBadge=rep.jiraKey?`<a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:2px 8px;border-radius:8px;margin-left:6px;font-family:var(--mono);text-decoration:underline">${rep.jiraKey}</a>`:'';
    return `<div class="history-item" onclick="viewReport('${rep.id||rep.fbId}')">
      <div class="history-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg></div>
      <div class="history-info">
        <div class="history-date">${paso?`<span style="color:var(--accent);font-weight:700">${escHtml(paso)}</span>`:''} ${opBadge} ${jiraBadge}</div>
        <div class="history-meta">${label} · ${count} ${nombreDispositivo(rep.scansSnapshot?.[0]?.producto || 'scanner', count!==1)}</div>
        <div class="history-meta">Inspector: ${escHtml(rep.inspectorName||'—')}</div>
        ${currentUser?.role==='supervisor'?`<div class="history-meta" style="color:var(--text3)">Técnico: ${escHtml(rep.technicianName||'—')}</div>`:''}
      </div>
      <div class="history-badge">${count}</div>
    </div>`;
  };

  if (currentUser?.role === 'supervisor') {
    // Supervisor: agrupar por técnico, ordenado cronológicamente dentro de cada grupo
    const byTech = new Map();
    sortedReports.forEach(rep => {
      const tech = rep.technicianName || '—';
      if (!byTech.has(tech)) byTech.set(tech, []);
      byTech.get(tech).push(rep);
    });
    // Ordenar técnicos por informe más reciente
    const techsSorted = [...byTech.entries()].sort((a,b) => {
      const ta = a[1][0].createdAt?.seconds ? a[1][0].createdAt.seconds*1000 : new Date(a[1][0].date+'T12:00:00').getTime();
      const tb = b[1][0].createdAt?.seconds ? b[1][0].createdAt.seconds*1000 : new Date(b[1][0].date+'T12:00:00').getTime();
      return tb - ta;
    });
    container.innerHTML = syncBanner + techsSorted.map(([techName, reps]) =>
      `<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg3);border-radius:10px;font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px">
        👤 ${escHtml(techName)} <span style="font-weight:400">(${reps.length} informe${reps.length!==1?'s':''})</span>
      </div>
      ${reps.map(renderRepCard).join('')}`
    ).join('');
  } else {
    // Técnico: lista cronológica simple (solo ve sus propios informes)
    container.innerHTML = syncBanner + sortedReports.map(renderRepCard).join('');
  }
}

// ======== VIEW REPORT ========
async function viewReport(id) {
  const rep = localReports.find(r=>(r.id===id||r.fbId===id));
  if (!rep) return;
  viewingReportId = id;

  // Auto-sync to Firebase if not yet saved (and online)
  if (!rep.fbId && currentUser && navigator.onLine) {
    const repFb = {
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
    };
    fbSaveReport(repFb).then(fbId => {
      const ri = localReports.findIndex(r=>r.id===id);
      if (ri>=0) { localReports[ri].fbId = fbId; rep.fbId = fbId; }
      setSyncStatus('ok');
    }).catch(e => console.warn('Auto-sync failed:', e.code||e.message));
  }

  let sig = rep.signature;
  if (!sig && rep.fbId) {
    try { sig = await fbGetSignature(rep.fbId); } catch(e) {}
  }
  // Prioridad para mostrar scans: 1) localScans (tiene fotos en memoria)
  // 2) scansSnapshot del informe (tiene datos pero no fotos)
  // Luego cargamos fotos desde R2 si no están en memoria
  let scans = localScans.filter(s=>rep.scanIds.includes(s.id||s.fbId));
  if (scans.length === 0 && rep.scansSnapshot?.length > 0) {
    scans = rep.scansSnapshot;
  }
  // Para cada scan sin fotos en memoria, intentar cargar desde R2
  const scansConFotos = await Promise.all(scans.map(async s => {
    if ((s.photos?.length || 0) > 0 || (s.photoUrls?.length || 0) > 0) return s;
    const scanKey = s.fbId || s.id;
    if (scanKey && navigator.onLine) {
      const urls = await loadPhotosFromR2(scanKey);
      if (urls.length > 0) return { ...s, photoUrls: urls };
    }
    return s;
  }));
  const d=new Date(rep.date+'T12:00:00');
  const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const scanRows=scansConFotos.map((s,i)=>{
    // Priorizar URLs de R2 sobre base64 en memoria
    const photoSrcs = s.photoUrls?.length > 0 ? s.photoUrls : (s.photos||[]);
    const photos=photoSrcs.map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('');
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:8px">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${photos}

      ${bloqueEquipoGridHtml(s, 'margin:8px 0 4px')}

      ${(s.producto && s.producto!=='scanner') ? `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">📍 Ubicación</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;font-family:var(--mono)">
        <div style="color:var(--text2)">Puesto: <span style="color:var(--text)">${escHtml(s.puesto||'—')}</span></div>
        ${s.lat?`<div style="color:var(--text3);font-size:10px;grid-column:1/-1">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?' — '+escHtml(s.address):''}</div>`:''}
      </div>` : `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">💻 PC</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;font-family:var(--mono)">
        ${s.pcNombre?`<div style="color:var(--text2)">Nombre PC: <span style="color:var(--text)">${escHtml(s.pcNombre)}</span></div>`:''}
        <div style="color:var(--text2)">Puesto: <span style="color:var(--text)">${escHtml(s.puesto||'—')}</span></div>
        ${s.lat?`<div style="color:var(--text3);font-size:10px;grid-column:1/-1">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?' — '+escHtml(s.address):''}</div>`:''}
      </div>`}
      ${(!s.producto||s.producto==='scanner')?datosSistemaHtml(s.datosSistema):''}
      ${datosSistemaHtml(s.datosSistema)}
      ${s.notas?`<div style="border-top:1px solid var(--border);padding-top:6px;margin-top:6px">${notasListHtml(s.notas)}</div>`:''}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">✅ Checklists</div>
      ${s.checklistItems?checklistItemsHtml(s.checklistItems):(s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist))}
      ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
      ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      ${s.opType==='reemplazo'?`<button class="btn-secondary" style="margin-top:8px;width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button>`:''}
    </div>`;
  }).join('');
  document.getElementById('view-report-content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div class="vr-title" style="margin:0">Informe de Visita</div>
      <img src="${DANAIDE_LOGO}" style="height:24px;object-fit:contain;opacity:.85">
    </div>
    <div class="vr-sub">${label} · ${contarDispositivos(scans)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector DNM',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: <a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(rep.jiraKey)}</a></div>`:''}
    ${scanRows}
    <div class="vr-sig-label">Firma del Inspector DNM — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px">Sin firma guardada</div>'}
  `;
  showPage('view-report');
}
window.viewReport = viewReport;

async function deleteReport() {
  if (!viewingReportId) return;
  if (!confirm('¿Eliminar este informe de tu lista?')) return;
  const rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  localReports=localReports.filter(r=>(r.id!==viewingReportId&&r.fbId!==viewingReportId));
  showToast('Informe eliminado'); goBack();

  // Borrado lógico: el documento sigue existiendo en Firestore (marcado
  // eliminado:true) para no perder datos de métricas/export — solo deja de
  // aparecer en la lista del técnico. El supervisor puede verlo/restaurarlo
  // desde la papelera.
  if (rep?.fbId) {
    try { await fbSoftDeleteReport(rep.fbId, currentUser?.id); } catch(e) {}
    return;
  }

  // Si el informe local no tiene fbId guardado (puede pasar si se guardó offline
  // y nunca se refrescó el objeto local tras sincronizar), buscamos en Firestore
  // un informe que coincida para aplicar el mismo borrado lógico ahí.
  if (rep) {
    try {
      const remotos = await fbGetAllReports(true);
      const match = remotos.find(r =>
        r.userId === rep.userId &&
        r.createdAt?.seconds && rep.createdAt?.seconds &&
        Math.abs(r.createdAt.seconds - rep.createdAt.seconds) < 5
      );
      if (match?.fbId) await fbSoftDeleteReport(match.fbId, currentUser?.id);
    } catch(e) {}
  }
}
window.deleteReport = deleteReport;

// ======== PDF EXPORT ========
async function buildReportPDFDoc(rep) {
  // Scan lookup priority:
  // 1. scansSnapshot embedded in report (most reliable)
  // 2. localScans cache
  // 3. Firebase fetch
  const scanIds = rep.scanIds || [];

  // Build photo cache from localStorage
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}
  const restorePhotos = (s) => {
    const photoUrls = s.photoUrls && s.photoUrls.length > 0 ? s.photoUrls : null;
    if (s.photos && s.photos.length > 0) return photoUrls ? { ...s, photoUrls } : s;
    const localPhotos = photoCache[s.id] || photoCache[s.fbId] || [];
    if (localPhotos.length > 0) return { ...s, photos: localPhotos, ...(photoUrls ? { photoUrls } : {}) };
    if (photoUrls) return { ...s, photos: photoUrls, photoUrls };
    return s;
  };

  // Priority 1: localScans (in-memory, has photos)
  let scans = localScans.filter(s => scanIds.includes(s.id) || scanIds.includes(s.fbId)).map(restorePhotos);

  // Priority 2: embedded snapshot
  if (scans.length === 0 && rep.scansSnapshot?.length > 0) {
    scans = rep.scansSnapshot.map(restorePhotos);
  }

  // Priority 3: Firebase
  if (scans.length === 0 && rep.userId) {
    try {
      const fbScans = await fbGetMyScans(rep.userId);
      const fbM = fbScans.filter(s => scanIds.includes(s.id) || scanIds.includes(s.fbId));
      if (fbM.length > 0) scans = fbM.map(restorePhotos);
    } catch(e) {}
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, M=15;
    let y = M;

    // ── HEADER ──
    doc.setFillColor(15,32,39);
    doc.rect(0,0,W,32,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,5,44,18); } catch(e){}
    doc.setTextColor(0,212,170); doc.setFontSize(17); doc.setFont('helvetica','bold');
    doc.text('ScanCheck', M+48, 14);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
    doc.text('Control de Mantenimiento Preventivo — Danaide Enterprise', M+48, 21);
    const d = new Date(rep.date+'T12:00:00');
    const dateLabel = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    doc.setTextColor(180,210,225); doc.setFontSize(8);
    doc.text(dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1), W-M, 14, {align:'right'});
    doc.text('Generado: '+new Date().toLocaleString('es-AR'), W-M, 21, {align:'right'});
    y = 38;

    // ── INFO BOX ──
    doc.setFillColor(22,36,54);
    doc.roundedRect(M,y,W-M*2,20,3,3,'F');
    const infoItems = [
      ['Técnico',      rep.technicianName||'—'],
      ['Inspector DNM',    rep.inspectorName||'—'],
      ['Dispositivos', String(scanIds.length)],
      ['Jira',         rep.jiraKey || rep.jiraTicketExistente || 'Pendiente']
    ];
    infoItems.forEach(([lbl,val],i) => {
      const cx = M+4+(i*(W-M*2)/4);
      doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125);
      doc.text(lbl, cx, y+7);
      doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248);
      doc.text(String(val).substring(0,24), cx, y+14);
    });
    y += 26;

    // ── SCANS NOT FOUND MESSAGE ──
    if (scans.length === 0) {
      doc.setFillColor(40,10,10);
      doc.roundedRect(M,y,W-M*2,20,3,3,'F');
      doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(255,100,100);
      doc.text('No se encontraron registros de dispositivos', M+4, y+9);
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(200,150,150);
      doc.text('Los registros fueron generados en otra sesión. Sincronizá y volvé a intentar.', M+4, y+16);
      y += 26;
    }

    // ── EACH SCAN ──
    for (let i=0; i<scans.length; i++) {
      const s = scans[i];
      if (y > 248) { doc.addPage(); y = M; }

      // Scan header
      doc.setFillColor(30,51,71);
      doc.roundedRect(M,y,W-M*2,10,2,2,'F');
      doc.setFillColor(0,212,170);
      doc.circle(M+6,y+5,3.5,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(15,32,39);
      doc.text(String(i+1), M+6, y+6, {align:'center'});
      doc.setTextColor(232,244,248); doc.setFontSize(9);
      doc.text((s.paso||'Sin descripcion').substring(0,55), M+13, y+6.5);
      const opCol = s.opType==='instalacion'?[0,174,255]:s.opType==='reemplazo'?[255,160,64]:[0,212,170];
      doc.setTextColor(...opCol); doc.setFontSize(7.5);
      doc.text(opLabel(s.opType), W-M-2, y+6.5, {align:'right'});
      y += 12;

      // Fields grid (2 rows x 4 cols) — según producto
      let fields;
      if (s.producto === 'totem') {
        fields = [
          ['PUESTO',        s.puesto||'—'],
          ['SERIE MINIPC',  s.serieMiniPC||s.serie||'—'],
          ['MODELO MINIPC', s.modeloMiniPC||'—'],
          ['HORA',          new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})],
          ['TIPO OP.',      opLabel(s.opType)],
        ];
        if (s.ipMiniPC) fields.push(['IP MINIPC', s.ipMiniPC]);
        if (s.macMiniPC) fields.push(['MAC MINIPC', s.macMiniPC]);
        if (s.serieCamara) fields.push(['SERIE CÁMARA', s.serieCamara]);
        if (s.modeloCamara) fields.push(['MOD/MARCA CÁMARA', s.modeloCamara]);
        if (s.seriePantalla) fields.push(['SERIE PANTALLA', s.seriePantalla]);
        if (s.modeloPantalla) fields.push(['MOD/MARCA PANTALLA', s.modeloPantalla]);
        if (s.invDnd) fields.push(['N° INV. DND', s.invDnd]);
        if (s.invDnm) fields.push(['N° INV. DNM', s.invDnm]);
        if (s.equipoReemplazado) fields.push(['EQUIPO REEMPLAZADO', s.equipoReemplazado]);
        if (s.serieRetira) { fields.push(['RETIRA', `${s.mmRetira||''} ${s.serieRetira}`]); fields.push(['NUEVO', `${s.mmNuevo||''} ${s.serieNuevo||'—'}`]); }
        if (s.estadoMiniPC) {
          const e = s.estadoMiniPC;
          if (e.cpu) fields.push(['CPU', `${e.cpu}${e.cores?` (${e.cores}c)`:''}`]);
          if (e.ramTotal) fields.push(['RAM', `${e.ramUsada||'?'}/${e.ramTotal} GB${e.ramPct?` (${e.ramPct}%)`:''}`]);
          if (e.discoTotal) fields.push(['DISCO', `${e.discoUsado||'?'}/${e.discoTotal}${e.discoPct?` (${e.discoPct})`:''}`]);
          if (e.so) fields.push(['SO', e.so]);
          if (e.kernel) fields.push(['KERNEL', e.kernel]);
        }
      } else if (s.producto === 'tablet') {
        fields = [
          ['PUESTO',      s.puesto||'—'],
          ['SERIE TABLET', s.serie||'—'],
          ['DEVICE ID',   s.deviceId||'—'],
          ['HORA',        new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})],
          ['TIPO OP.',    opLabel(s.opType)],
        ];
        if (s.ip) fields.push(['IP', s.ip]);
        if (s.mac) fields.push(['MAC ADD', s.mac]);
        if (s.serieRetira) { fields.push(['SERIE RETIRA', s.serieRetira]); fields.push(['SERIE NUEVA', s.serieNuevo||'—']); }
        if (s.deviceIdRetira) fields.push(['DEVICE ID RETIRA', s.deviceIdRetira]);
        if (s.deviceIdNuevo) fields.push(['DEVICE ID NUEVA', s.deviceIdNuevo]);
      } else {
        fields = [
          ['PUESTO',    s.puesto||'—'],
          ['SERIE PC',  s.serie||'—'],
          ['NOMBRE PC', s.pcNombre||'—'],
          ['HORA',      new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})],
          ['TIPO OP.',  opLabel(s.opType)],
        ];
        if (s.scannerSerie)  fields.push(['SERIE SCANNER', s.scannerSerie]);
        if (s.scannerModelo) fields.push(['MODELO SCANNER', s.scannerModelo]);
        if (s.scannerEstado) fields.push(['ESTADO SCANNER', s.scannerEstado]);
        if (s.invDnd) fields.push(['N° INV. DND', s.invDnd]);
        if (s.invDnm) fields.push(['N° INV. DNM', s.invDnm]);
        // Cambio de equipo por incidencia
        if (s.serieRetira) { fields.push(['SERIE RETIRA', s.serieRetira]); fields.push(['SERIE NUEVA', s.serieNuevo||'—']); }
        // Instalación con reemplazo: equipo del contrato anterior que se retira.
        // Faltaba en el PDF (sí figuraba en el detalle, en el informe en pantalla
        // y en la exportación a Sheets), así que el acta impresa no dejaba
        // constancia de qué equipo se retiró.
        if (s.instalacionReemplazoData) {
          const r = s.instalacionReemplazoData;
          if (r.marcaVieja) fields.push(['MARCA RETIRADA', r.marcaVieja]);
          if (r.serieVieja) fields.push(['SERIE RETIRADA', r.serieVieja]);
        }
      }
      if (s.lat) fields.push(['GPS', s.lat.toFixed(5)+', '+s.lon.toFixed(5)]);

      const colW = (W-M*2)/4;
      const rowH = 13;
      const rows = Math.ceil(fields.length/4);
      // Reserve extra space for address line inside the same box
      const addrLines = s.address ? doc.splitTextToSize('Dirección: '+s.address, W-M*2-8) : [];
      const addrH = addrLines.length ? (addrLines.length*4 + 4) : 0;
      doc.setFillColor(22,36,54);
      doc.roundedRect(M,y,W-M*2,rows*rowH+addrH,2,2,'F');
      fields.forEach(([lbl,val],fi) => {
        const col = fi%4, row = Math.floor(fi/4);
        const cx = M+4+col*colW;
        const cy = y+row*rowH;
        doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125);
        doc.text(lbl, cx, cy+5);
        doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.setFontSize(8);
        doc.text(String(val).substring(0,22), cx, cy+11);
      });
      // Dirección dentro del mismo recuadro, debajo de los campos
      if (addrLines.length) {
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
        doc.text(addrLines, M+4, y+rows*rowH+4);
      }
      y += rows*rowH + addrH + 3;

      // Checklist de inspección — Instalación usa su propio checklist, el resto usa el de mantenimiento
      const esInstalacionPdf = s.opType === 'instalacion_nueva' || s.opType === 'instalacion_reemplazo';
      const cklLines = s.checklistItems ? checklistItemsLines(s.checklistItems) : (esInstalacionPdf ? checklistInstalacionLines(s.checklistInstalacion) : checklistLines(s.checklist));
      if (cklLines.length > 0) {
        if (y > 250) { doc.addPage(); y = M; }
        doc.setFillColor(18,30,44);
        doc.roundedRect(M, y, W-M*2, cklLines.length*5.5+4, 2, 2, 'F');
        cklLines.forEach((line, li) => {
          const isOk = line.startsWith('OK');
          doc.setFontSize(7.5); doc.setFont('helvetica','bold');
          doc.setTextColor(...(isOk ? [0,212,170] : [120,140,155]));
          doc.text(line, M+4, y+5.5+li*5.5);
        });
        y += cklLines.length*5.5+4 + 3;
      }

      // Checklist de Tipo de Falla detectada (solo para reemplazos, viene del Acta)
      const fallaLines = s.opType === 'reemplazo' ? fallaChecklistLines(s.actaReemplazo)
                       : s.opType === 'falla_reparable' ? fallaReparableLines(s.fallaReparable)
                       : [];
      const fallaTitulo = s.opType === 'reemplazo' ? 'TIPO DE FALLA DETECTADA (Acta de Reemplazo)'
                        : s.opType === 'falla_reparable' ? 'FALLA REPARADA EN SITIO'
                        : '';
      if (fallaLines.length > 0) {
        if (y + fallaLines.length*5.5+10 > 270) { doc.addPage(); y = M; }
        doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(255,160,64);
        doc.text(fallaTitulo, M+4, y+3.5);
        y += 5.5;
        doc.setFillColor(18,30,44);
        doc.roundedRect(M, y, W-M*2, fallaLines.length*5.5+4, 2, 2, 'F');
        fallaLines.forEach((line, li) => {
          const isOk = line.startsWith('OK');
          doc.setFontSize(7.5); doc.setFont('helvetica','bold');
          doc.setTextColor(...(isOk ? [255,160,64] : [120,140,155]));
          doc.text(line, M+4, y+5.5+li*5.5);
        });
        y += fallaLines.length*5.5+4 + 3;
      }

      // Datos del sistema PC (disco, USB, uptime) — si vienen del QR del ps1 v2
      const ds = s.datosSistema;
      if (ds && Object.keys(ds).length) {
        const dsLines = [];
        if (ds.uptime)       dsLines.push(`Uptime: ${ds.uptime}  |  Último reinicio: ${ds.ultimoRein||''}`);
        if (ds.reinPend)     dsLines.push(`Reinicio pendiente: ${ds.reinPend}`);
        if (ds.updPend)      dsLines.push(`Actualizaciones de Windows pendientes: ${ds.updPend}`);
        if (ds.discoModelo)  dsLines.push(`Disco: ${ds.discoModelo} (${ds.discoTipo||''}) — SMART: ${ds.discoSMART||''}`);
        if (ds.discoTotalGB) dsLines.push(`Espacio C: ${ds.discoLibreGB} GB libres / ${ds.discoTotalGB} GB (${ds.discoUsoPct}% uso)`);
        if (ds.discoTempC && ds.discoTempC!=='N/D') dsLines.push(`Temperatura disco: ${ds.discoTempC}°C`);
        if (ds.usbTotal)     dsLines.push(`USB: ${ds.usbTotal} dispositivos detectados — ${ds.usbErrores} con error`);
        if (ds.servicioEstado) dsLines.push(`Servicio AssureID: ${ds.servicioEstado}`);
        if (ds.docLibFecha)  dsLines.push(`Librería AssureID actualizada: ${ds.docLibFecha}`);
        if (dsLines.length) {
          if (y + dsLines.length*5.5+12 > 270) { doc.addPage(); y = M; }
          doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(150,180,200);
          doc.text('ESTADO DEL SISTEMA (PC)', M+4, y+3.5);
          y += 5.5;
          doc.setFillColor(18,30,44);
          doc.roundedRect(M, y, W-M*2, dsLines.length*5.5+4, 2, 2, 'F');
          dsLines.forEach((line, li) => {
            const isAlert = line.includes('SI -') || (line.includes('Error') && !line.includes('0 con error')) || (line.includes('Servicio AssureID:') && !line.toLowerCase().includes('corriendo'));
            doc.setFontSize(7.5); doc.setFont('helvetica', isAlert ? 'bold' : 'normal');
            doc.setTextColor(...(isAlert ? [255,160,64] : [160,190,210]));
            doc.text(line, M+4, y+5.5+li*5.5);
          });
          y += dsLines.length*5.5+4 + 3;
        }
      }

      // Photos — TODAS en grilla de 2 columnas
      // Prioridad: 1) base64 en memoria, 2) photoUrls en scan, 3) buscar en R2 por fbId
      const urlToB64 = url => new Promise(res => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; c.getContext('2d').drawImage(img,0,0); res(c.toDataURL('image/jpeg',0.85)); };
        img.onerror = () => res(null);
        img.src = url;
      });
      let photos = [];
      if (s.photos?.length > 0) {
        photos = s.photos;
      } else {
        let urls = s.photoUrls?.length > 0 ? s.photoUrls : [];
        if (urls.length === 0 && (s.fbId||s.id) && navigator.onLine) {
          urls = await loadPhotosFromR2(s.fbId||s.id);
        }
        if (urls.length > 0) {
          photos = (await Promise.all(urls.map(urlToB64))).filter(Boolean);
        }
      }
      if (photos.length > 0) {
        const cols = Math.min(photos.length, 2);
        const pw = (W - M*2 - (cols > 1 ? 4 : 0)) / cols;
        const ph = pw * 0.62;
        for (let pi = 0; pi < photos.length; pi++) {
          const col = pi % cols;
          if (col === 0 && (y + ph) > 272) { doc.addPage(); y = M; }
          try { doc.addImage(photos[pi], 'JPEG', M + col*(pw+4), y, pw, ph, '', 'FAST'); } catch(e){}
          if (col === cols-1 || pi === photos.length-1) { y += ph + 4; }
        }
      }

      // Notas — formatted as list (each line on its own row)
      if (s.notas && s.notas.trim()) {
        const noteLines = s.notas.split('\n').filter(l => l.trim());
        if (noteLines.length > 0) {
          if (y+4+noteLines.length*5 > 275) { doc.addPage(); y=M; }
          doc.setFillColor(18,28,42);
          doc.roundedRect(M,y,W-M*2,4+noteLines.length*5+2,2,2,'F');
          doc.setDrawColor(0,212,170,50); doc.setLineWidth(0.3);
          doc.line(M+3,y+1,M+3,y+3+noteLines.length*5);
          doc.setFontSize(7.5); doc.setFont('helvetica','normal');
          noteLines.forEach((line,li) => {
            const isSection = line.startsWith('---');
            if (isSection) {
              doc.setTextColor(0,212,170); doc.setFont('helvetica','bold');
              doc.text(line.replace(/---/g,'').trim(), M+6, y+5+li*5);
              doc.setFont('helvetica','normal');
            } else {
              // Split key: value lines
              const colonIdx = line.indexOf(':');
              if (colonIdx > 0) {
                const key = line.substring(0,colonIdx).trim();
                const val = line.substring(colonIdx+1).trim();
                doc.setTextColor(74,106,125); doc.setFont('helvetica','bold');
                doc.text(key+':', M+6, y+5+li*5);
                doc.setTextColor(220,236,244); doc.setFont('helvetica','normal');
                doc.text(val.substring(0,60), M+6+doc.getTextWidth(key+':')+2, y+5+li*5);
              } else {
                doc.setTextColor(220,236,244);
                doc.text(line.substring(0,70), M+6, y+5+li*5);
              }
            }
          });
          y += 4+noteLines.length*5+4;
        }
      }
      y += 5;
    }

    // ── FIRMA ──
    doc.addPage(); y=M;
    doc.setFillColor(15,32,39); doc.rect(0,0,W,18,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,2,36,14); } catch(e){}
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(0,180,130);
    doc.text('Firma del Inspector DNM Responsable', M+40, 11);
    y = 28;
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Inspector DNM:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(rep.inspectorName||'—', M+28, y); y+=8;
    doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Técnico:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(rep.technicianName||'—', M+28, y); y+=8;
    doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Fecha:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(dateLabel, M+28, y); y+=14;
    doc.setDrawColor(0,180,130); doc.setLineWidth(0.5);
    doc.line(M, y, W-M, y); y+=8;

    let sig = rep.signature;
    if (!sig && rep.fbId) { try { sig = await fbGetSignature(rep.fbId); } catch(e){} }
    if (sig) { try { sig = await signatureToBlack(sig); } catch(e){} }
    if (sig) {
      try {
        doc.addImage(sig,'PNG',M,y,90,40);
        doc.setDrawColor(0,180,130); doc.setLineWidth(0.4);
        doc.rect(M,y,90,40);
        y += 44;
        doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,20);
        doc.text(rep.inspectorName||'', M, y);
        doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(80,80,80);
        doc.text('Firma del inspector responsable', M, y+5);
      } catch(e){}
    }
    y += 20;
    doc.setFillColor(15,32,39); doc.rect(0,275,W,22,'F');
    doc.setFontSize(7); doc.setTextColor(180,200,210);
    doc.text('ScanCheck — Danaide Enterprise  |  '+new Date().toLocaleString('es-AR'), W/2, 283, {align:'center'});

    // El nombre incluye al técnico: en un paso donde trabajan varios el mismo
    // día con el mismo ticket, los PDF se adjuntan al mismo Jira y con solo la
    // fecha quedarían dos archivos idénticos en el nombre, imposibles de
    // distinguir sin abrirlos.
    const tecnicoSlug = (rep.technicianName || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // saca acentos
      .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const filename = 'informe-scancheck-' + rep.date + (tecnicoSlug ? '-' + tecnicoSlug : '') + '.pdf';
    return { doc, filename };

  } catch(e) {
    console.error('PDF error:', e);
    throw e;
  }
}

async function downloadReportPDF() {
  const rep = localReports.find(r => r.id===viewingReportId || r.fbId===viewingReportId);
  if (!rep) { showToast('Informe no encontrado','error'); return; }
  showToast('Generando PDF...','success');
  try {
    const { doc, filename } = await buildReportPDFDoc(rep);
    doc.save(filename);
    showToast('✓ PDF descargado','success');
  } catch(e) {
    showToast('Error al generar PDF','error');
  }
}
window.downloadReportPDF = downloadReportPDF;

async function downloadActaReemplazo(scanId) {
  const scan = localScans.find(s=>(s.id===scanId||s.fbId===scanId));
  if (!scan) { showToast('Registro no encontrado','error'); return; }
  // Buscar el informe que contiene este scan, para obtener técnico/inspector
  let rep = localReports.find(r => (r.scanIds||[]).includes(scan.id) || (r.scanIds||[]).includes(scan.fbId));
  if (!rep) {
    // Respaldo: usar datos del propio scan/usuario actual si no se encuentra un informe asociado todavía
    rep = { technicianName: scan.userName || currentUser?.name || '—', inspectorName: '—', date: scan.timestamp?.slice(0,10) };
  }
  showToast('Generando Acta...','success');
  try {
    const { doc, filename } = await buildActaReemplazoPDFDoc(rep, scan);
    doc.save(filename);
    showToast('✓ Acta descargada','success');
  } catch(e) {
    console.error('Error generando Acta de Reemplazo:', e);
    showToast('Error al generar el Acta','error');
  }
}
window.downloadActaReemplazo = downloadActaReemplazo;

// ======== ACTA DE CONSTATACIÓN TÉCNICA Y REEMPLAZO ========
// Documento legal — el texto y estructura NO deben modificarse (Licitación Pública N° 21-0004-LPU25,
// Orden de Compra N° 21-0009-OCA25, Renglón N° 1, DNM / Danaide S.A.)
const FALLA_LABELS = {
  alimentacion:  'Falla de alimentación eléctrica',
  cristal:       'Cristal roto u opaco / desgastado',
  usb:           'Falla de conexión USB / Cables / comunicación con la estación de trabajo',
  mrz:           'Falla de lectura MRZ',
  chip:          'Falla de lectura de chip / documento electrónico',
  sensor:        'Falla de sensor óptico',
  irrojo:        'Falla de lectura infrarroja / ultravioleta',
  mecanica:      'Falla mecánica',
  intermitente:  'Falla intermitente recurrente',
  danoFisico:    'Daño físico visible',
  obsolescencia: 'Obsolescencia / desgaste'
};

async function buildActaReemplazoPDFDoc(rep, scan) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, H=297, M=15;
  let y;

  const drawHeader = () => {
    doc.setFillColor(15,32,39);
    doc.rect(0,0,W,24,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,4,38,16); } catch(e){}
    doc.setTextColor(0,212,170); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('ACTA DE CONSTATACIÓN TÉCNICA Y REEMPLAZO DE EQUIPAMIENTO', W-M, 11, {align:'right'});
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(180,210,225);
    doc.text('Licitación Pública N° 21-0004-LPU25 — Orden de Compra N° 21-0009-OCA25 — Renglón N° 1', W-M, 17, {align:'right'});
    return 30;
  };

  const drawFooter = (pageNum, totalPages) => {
    doc.setFillColor(15,32,39); doc.rect(0,287,W,10,'F');
    doc.setFontSize(7); doc.setTextColor(180,200,210);
    doc.text('DANAIDE S.A.', M, 293);
    doc.text(`Página ${pageNum} de ${totalPages}`, W-M, 293, {align:'right'});
  };

  y = drawHeader();

  // Texto introductorio
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(30,30,30);
  const introText = 'Entre la DIRECCIÓN NACIONAL DE MIGRACIONES, en adelante "la DNM", y la firma DANAIDE S.A., en adelante "el Proveedor", se suscribe la presente Acta de Constatación Técnica y Reemplazo de equipamiento.';
  let lines = doc.splitTextToSize(introText, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 2;

  const introText2 = 'La presente tiene por objeto dejar constancia de la evaluación técnica efectuada sobre un lector documental comprendido en el servicio contratado, su condición de fuera de servicio y el reemplazo por un nuevo equipo, conforme las previsiones contractuales aplicables.';
  lines = doc.splitTextToSize(introText2, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 6;

  // ── SECCIÓN 1: DATOS DEL LECTOR DOCUMENTAL ──
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('1. DATOS DEL LECTOR DOCUMENTAL', M, y); y += 6;

  const fecha = new Date(scan.timestamp);
  const fechaStr = fecha.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const horaStr = fecha.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  const marcaModeloViejo = scan.scannerModelo || '—';

  const drawField = (label, value) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(60,60,60);
    doc.text(label, M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
    doc.text(String(value||'—'), M+62, y);
    y += 6.5;
  };

  drawField('Fecha de revisión técnica:', `${fechaStr}   Hora: ${horaStr}`);
  drawField('Dependencia / Paso fronterizo / Sede:', scan.paso || '—');
  drawField('Marca/Modelo:', marcaModeloViejo);
  drawField('Nro. de serie:', scan.scannerSerie||scan.serieRetira||'—');
  drawField('Nro. Inventario DNM:', scan.invDnm || '—');
  drawField('Técnico interviniente del Proveedor:', rep.technicianName || '—');
  y += 3;

  // ── SECCIÓN 2: DESCRIPCIÓN DE LA FALLA ──
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('2. DESCRIPCIÓN DE LA FALLA', M, y); y += 6;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const fallaIntro = 'Se deja constancia de que el lector documental identificado precedentemente fue evaluado técnicamente, constatándose que no se encuentra en condiciones de continuar prestando el servicio requerido.';
  lines = doc.splitTextToSize(fallaIntro, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 3;

  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.text('Tipo de falla detectada:', M, y); y += 6;

  const ck = scan.actaReemplazo?.fallaChecklist || {};
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  Object.keys(FALLA_LABELS).forEach(key => {
    const checked = !!ck[key];
    doc.setDrawColor(80,80,80);
    doc.rect(M, y-3, 4, 4);
    if (checked) {
      doc.setFont('helvetica','bold');
      doc.text('X', M+0.8, y-0.1);
      doc.setFont('helvetica','normal');
    }
    doc.text(FALLA_LABELS[key], M+7, y);
    y += 5.5;
    if (y > 265) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  });
  // Otro
  doc.rect(M, y-3, 4, 4);
  if (ck.otro) { doc.setFont('helvetica','bold'); doc.text('X', M+0.8, y-0.1); doc.setFont('helvetica','normal'); }
  doc.text(`Otro: ${ck.otroTexto || '_______________________________'}`, M+7, y);
  y += 8;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  const fallaConclusion = 'En función de lo expuesto, el Proveedor deja constancia de que el lector documental indicado se encuentra fuera de servicio y no resulta apto para garantizar la continuidad operativa del puesto documental en condiciones adecuadas.';
  lines = doc.splitTextToSize(fallaConclusion, W-M*2);
  if (y + lines.length*4.2 > 265) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.text(lines, M, y); y += lines.length*4.2 + 6;

  // ── SECCIÓN 3: CONSTANCIA DE REEMPLAZO ──
  if (y > 245) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('3. CONSTANCIA DE REEMPLAZO', M, y); y += 6;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const reemplazoIntro = 'A efectos de asegurar la continuidad operativa del servicio, el Proveedor procede al reemplazo del lector documental indicado por un nuevo equipo, conforme el siguiente detalle:';
  lines = doc.splitTextToSize(reemplazoIntro, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 4;

  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.text('DATOS DEL NUEVO LECTOR DOCUMENTAL INSTALADO', M, y); y += 6.5;

  const nuevoMarcaModelo = scan.actaReemplazo?.nuevoMarcaModelo || scan.scannerModelo || '—';
  drawField('Marca/Modelo:', nuevoMarcaModelo);
  drawField('N° Serie:', scan.serieNuevo || '—');
  y += 3;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const comodatoText = 'El equipo provisto en reemplazo se entrega en carácter de comodato, sin costo adicional para la DNM, durante la vigencia del servicio contratado, conforme las previsiones del Renglón N° 1 del Pliego.';
  lines = doc.splitTextToSize(comodatoText, W-M*2);
  if (y + lines.length*4.2 > 250) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.setTextColor(30,30,30);
  doc.text(lines, M, y); y += lines.length*4.2 + 8;

  // ── FIRMA ──
  let sig = rep.signature;
  if (!sig && rep.fbId) { try { sig = await fbGetSignature(rep.fbId); } catch(e){} }
  if (sig) { try { sig = await signatureToBlack(sig); } catch(e){} }
  const sigW = 80, sigH = 30;
  if (y + sigH + 16 > 270) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  if (sig) {
    try { doc.addImage(sig,'PNG',M+30,y,sigW,sigH); } catch(e) {}
    y += sigH + 3;
  } else {
    y += 10;
  }
  doc.setDrawColor(60,60,60);
  doc.line(M+30, y, M+30+sigW, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(15,32,39);
  doc.text('Inspector DNM', M+30+sigW/2, y, {align:'center'}); y += 5;
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(60,60,60);
  doc.text(rep.inspectorName || '—', M+30+sigW/2, y, {align:'center'});

  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  const fechaArchivo = scan.timestamp ? scan.timestamp.slice(0,10) : rep.date;
  return { doc, filename: `acta-reemplazo-${scan.scannerSerie||scan.serie||'sn'}-${fechaArchivo}.pdf` };
}


// ======== JIRA ========
// Configuración fija — el proyecto y tipo de incidencia no son sensibles.
// Las credenciales reales (email/token de Atlassian) viven solo como Secrets
// en el Cloudflare Worker, nunca en el celular del técnico.
function loadJiraConfig() {
  return { project: 'DND', issueType: 'Incidente' };
}

async function sendToJira() {
  const cfg=loadJiraConfig();
  if(!cfg.project){showToast('Error de configuración interna de Jira','error');return;}

  // Buscar el informe: primero en cache local (técnico propio), sino en Firestore (supervisor viendo otro técnico)
  let rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  if(!rep){
    try{
      const allReports=await fbGetAllReports();
      rep=allReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
    }catch(e){}
  }
  if(!rep){ showToast('No se encontró el informe','error'); return; }

  // Buscar los scans del informe: localScans (propio) → scansSnapshot embebido → Firestore del técnico dueño
  let scans=localScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
  if(scans.length===0 && rep.scansSnapshot?.length>0){
    scans=rep.scansSnapshot;
  }
  if(scans.length===0 && rep.userId){
    try{
      const fbScans=await fbGetMyScans(rep.userId);
      scans=fbScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
    }catch(e){}
  }
  if(scans.length===0){
    console.warn('sendToJira: no se encontraron scans para el informe', rep.id||rep.fbId, '— scanIds esperados:', rep.scanIds);
  }
  console.log('sendToJira: scans a procesar =', scans.length, scans);

  const d=new Date(rep.date+'T12:00:00');
  const dateLabel=d.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});
  showToast('Enviando a Jira...','success');
  const mkDoc=(text)=>({version:1,type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]});

  // Llamada via proxy (Cloudflare Worker) — las credenciales de Jira viven solo en el Worker (Secrets),
  // nunca se mandan desde el celular del técnico.
  const jiraCall = async (path, jiraBody, method='POST') => {
    const r = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        path, method, jiraBody
      })
    });
    return r;
  };

  // Sube un archivo adjunto a un ticket de Jira (PDF, etc.) via el proxy
  const jiraUpload = async (issueKey, filename, base64, contentType) => {
    const r = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        path: `/rest/api/3/issue/${issueKey}/attachments`,
        attachment: { filename, base64, contentType }
      })
    });
    return r;
  };

  // Busca el accountId de Jira correspondiente a un email, para poder asignar tickets automáticamente
  const jiraFindAccountId = async (email) => {
    if (!email) return null;
    try {
      const r = await jiraCall(`/rest/api/3/user/search?query=${encodeURIComponent(email)}`, null, 'GET');
      if (!r.ok) return null;
      const users = await r.json();
      const match = users.find(u => (u.emailAddress||'').toLowerCase() === email.toLowerCase()) || users[0];
      return match ? match.accountId : null;
    } catch(e) {
      console.warn('No se pudo resolver accountId de Jira para', email, e);
      return null;
    }
  };

  // Resolver el técnico dueño del informe — puede ser distinto de quien envía (ej: supervisor)
  const technicianEmail = rep.technicianEmail || (rep.userId===currentUser?.id ? currentUser?.email : null);
  const assigneeAccountId = await jiraFindAccountId(technicianEmail);
  if (technicianEmail && !assigneeAccountId) {
    console.warn('No se encontró cuenta de Jira para el email', technicianEmail, '— los tickets quedarán sin asignar');
  }
  const ASSIGNEE_FIELD = assigneeAccountId ? { assignee: { id: assigneeAccountId } } : {};

  // Campos fijos requeridos en todos los tickets ScanCheck
  const FIXED_FIELDS = {
    customfield_10058: { id: '10061' }, // Equipo asignado = Operaciones
    customfield_10102: { id: '10337' }  // Contratos = Dirección Nacional de Migraciones
  };

  // Determinar el tipo de ticket padre según las operaciones del informe:
  // - Si hay algún reemplazo → Incidente
  // - Mantenimiento / Instalación → Solicitud de servicio
  const tieneReemplazo = scans.some(s => s.opType === 'cambio_equipo' || s.opType === 'reemplazo');
  const tieneInstalacion = scans.some(s => s.opType === 'instalacion_nueva' || s.opType === 'instalacion_reemplazo' || s.opType === 'instalacion');
  const tieneFallaReparable = scans.some(s => s.opType === 'falla_reparable');
  const esIncidencia = tieneReemplazo || tieneFallaReparable;
  const issueTypePadre = esIncidencia ? 'Incidente' : 'Solicitud de servicio';

  const modoLabel = tieneReemplazo ? 'Incidencia - Cambio de equipo'
    : tieneFallaReparable ? 'Incidencia - Falla reparable en sitio'
    : scans.some(s => s.opType === 'instalacion_reemplazo') ? 'Instalación - Reemplazo'
    : tieneInstalacion ? 'Instalación - Puesto nuevo'
    : 'Mantenimiento Preventivo';

  // Extraer provincia de la dirección GPS (Nominatim: "..., Provincia, CódigoPostal, Argentina")
  const primerScan = scans.find(s => s.address) || scans[0];
  const address = primerScan?.address || '';
  const provincia = (() => {
    if (!address) return '';
    const parts = address.split(',').map(p => p.trim()).filter(Boolean);
    // Nominatim termina en "Argentina", antes viene el código postal, y antes la provincia
    const argIdx = parts.findLastIndex(p => p.toLowerCase() === 'argentina');
    if (argIdx >= 2) return parts[argIdx - 2];
    if (argIdx >= 1) return parts[argIdx - 1];
    return parts[parts.length - 2] || '';
  })();

  // Paso del informe (primer scan con paso definido)
  const pasoLabel = primerScan?.paso || rep.paso || '—';

  // Título formateado del ticket: DND - Modo - Paso - Provincia
  const tituloTicket = `DND - ${modoLabel} - ${pasoLabel}${provincia ? ' - ' + provincia : ''}`;

  // Campo Hardware según producto del informe:
  // scanner → Escaner (id 10802) | totem → 'Tótem TVF' (por value) | tablet → 'Tablet' (por value)
  const productoInforme = rep.producto || scans[0]?.producto || 'scanner';
  const HARDWARE_FIELD = productoInforme === 'totem'
    ? { customfield_10049: { value: 'Tótem TVF' } }
    : (productoInforme === 'tablet'
      ? { customfield_10049: { value: 'Tablet' } }
      : { customfield_10049: { id: '10802' } });
  // Campo Productos (customfield_10103): para scanner lo completa Jira solo
  // ("Scanner"); para tótem/tablet lo enviamos explícito.
  const PRODUCTOS_FIELD = productoInforme === 'totem'
    ? { customfield_10103: { value: 'Totems' } }
    : (productoInforme === 'tablet'
      ? { customfield_10103: { value: 'Ultra IP - App móvil' } }
      : {});

  try {
    let parentKey;
    const ticketExistente = rep.jiraTicketExistente?.trim().toUpperCase() || null;

    if (ticketExistente) {
      // ── FLUJO: ticket ya existente en Jira ──
      // Verificar que el ticket existe y es accesible
      showToast('Verificando ticket existente...','success');
      const checkRes = await jiraCall(`/rest/api/3/issue/${ticketExistente}`, null, 'GET');
      if (!checkRes.ok) {
        const err = await checkRes.text();
        showJiraError(`No se encontró el ticket ${ticketExistente}. Verificá el número. Detalle: ${err}`);
        return;
      }
      parentKey = ticketExistente;

      // Si el trabajo lleva varios días con el mismo ticket (ej: un preventivo
      // grande en un Paso), no queremos PISAR la descripción cada vez — sumamos
      // un bloque nuevo por cada día/informe, conservando el historial completo
      // de fechas, inspectores que firmaron, y dispositivos atendidos por día.
      const ticketData = await checkRes.json();
      const descActual = ticketData.fields?.description;
      // Extrae el texto plano ya guardado (mkDoc genera un único nodo de texto
      // por párrafo); si la descripción tiene otro formato (vacía, editada a
      // mano con formato ADF más complejo), simplemente no se reutiliza y
      // arrancamos un bloque nuevo limpio.
      let textoPrevio = '';
      try {
        const parrafos = descActual?.content || [];
        textoPrevio = parrafos
          .map(p => (p.content || []).map(c => c.text || '').join(''))
          .join('\n')
          .trim();
      } catch(e) {}

      // Cada bloque identifica a su técnico: en un paso pueden trabajar varios
      // el mismo día contra el mismo ticket, y sin el nombre no se sabría quién
      // hizo qué (el encabezado inicial solo nombra al primero).
      const bloqueNuevo = `Fecha: ${dateLabel}\nTécnico: ${rep.technicianName}\nDispositivos atendidos: ${scans.length}\nInspector DNM: ${rep.inspectorName}`;
      const descripcionFinal = textoPrevio
        ? `${textoPrevio}\n\n— — —\n\n${bloqueNuevo}`
        : `[ScanCheck] Informe cargado automáticamente\n\n${bloqueNuevo}`;

      const updateRes = await jiraCall(`/rest/api/3/issue/${parentKey}`, {
        fields: { description: mkDoc(descripcionFinal) }
      }, 'PUT');
      if (!updateRes.ok) {
        console.warn('No se pudo actualizar la descripción del ticket existente:', await updateRes.text());
      }

      // Asignar SOLO si el ticket todavía no tiene responsable. Si ya lo tiene
      // (por ejemplo, el primer técnico que cargó su informe), no se lo quitamos:
      // los demás quedan identificados igual en la descripción y en sus subtareas.
      const yaAsignado = !!ticketData.fields?.assignee;
      if (assigneeAccountId && !yaAsignado) {
        await jiraCall(`/rest/api/3/issue/${parentKey}`, { fields: { assignee: { id: assigneeAccountId } } }, 'PUT');
      } else if (yaAsignado) {
        console.log('Ticket ya asignado a', ticketData.fields.assignee.displayName, '— no se reasigna.');
      }

      showToast(`Usando ticket existente: ${parentKey}`, 'success');

    } else {
      // ── FLUJO: crear ticket nuevo ──
      const issueRes = await jiraCall('/rest/api/3/issue', {
        fields:{project:{key:cfg.project},summary:tituloTicket,description:mkDoc(`Técnico: ${rep.technicianName}\nInspector DNM: ${rep.inspectorName}\nDispositivos: ${scans.length}`),issuetype:{name:issueTypePadre},...FIXED_FIELDS,...HARDWARE_FIELD,...PRODUCTOS_FIELD,...ASSIGNEE_FIELD}
      });
      if(!issueRes.ok){const err=await issueRes.text();showJiraError(err);return;}
      const issue=await issueRes.json();
      parentKey=issue.key;
    }

    // Generar el PDF del informe y adjuntarlo al ticket padre (existente o nuevo)
    try {
      showToast('Adjuntando PDF al ticket...','success');
      const { doc, filename } = await buildReportPDFDoc(rep);
      const dataUri = doc.output('datauristring'); // "data:application/pdf;base64,XXXX"
      const base64 = dataUri.split(',')[1];
      const upRes = await jiraUpload(parentKey, filename, base64, 'application/pdf');
      if (!upRes.ok) {
        const errTxt = await upRes.text();
        console.error('Error al adjuntar PDF:', errTxt);
        showToast('Ticket actualizado, pero no se pudo adjuntar el PDF', 'error');
      }
    } catch(e) {
      console.error('Error generando/adjuntando PDF:', e);
    }

    // Algunos workflows de Jira exigen que el ticket padre esté "En proceso" antes de
    // permitir crear/transicionar subtareas. Intentamos esa transición automáticamente.
    try {
      const transRes = await jiraCall(`/rest/api/3/issue/${parentKey}/transitions`, null, 'GET');
      if (transRes.ok) {
        const transData = await transRes.json();
        const enProceso = (transData.transitions||[]).find(t => t.name === 'En proceso' || t.to?.name === 'En proceso');
        if (enProceso) {
          const doTransRes = await jiraCall(`/rest/api/3/issue/${parentKey}/transitions`, { transition: { id: enProceso.id } }, 'POST');
          if (doTransRes.ok) {
            console.log('sendToJira: ticket padre transicionado a En proceso');
          } else {
            console.warn('sendToJira: no se pudo transicionar el padre a En proceso:', await doTransRes.text());
          }
        }
      }
    } catch(transErr) {
      console.warn('sendToJira: error al intentar transicionar el padre:', transErr);
    }

    const subtaskKeys=[];
    console.log('sendToJira: empezando loop de', scans.length, 'subtareas');
    for(const s of scans){
      console.log('sendToJira: creando subtarea para', s.id||s.fbId, s.serie);
      // Si el scan tiene GPS pero no se llegó a resolver la dirección en el momento del relevamiento, la buscamos ahora
      if (s.lat && s.lon && !s.address) {
        try {
          const gr = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${s.lat}&lon=${s.lon}&zoom=16`);
          const gd = await gr.json();
          if (gd.display_name) s.address = gd.display_name;
        } catch(e) {}
      }
      const hardwareAsociado = [
        s.scannerModelo ? `Modelo: ${s.scannerModelo}` : null,
        s.scannerSerie ? `N° Serie: ${s.scannerSerie}` : null
      ].filter(Boolean).join('\n') || undefined;
      let sr;
      try {
        sr = await jiraCall('/rest/api/3/issue', {
          fields:{project:{key:cfg.project},parent:{key:parentKey},summary:`[${opLabel(s.opType)}] ${s.paso||'Sin paso'} — Serie ${s.serie} — Puesto ${s.puesto||'—'} (Ref: ${parentKey})`,
            description:mkDoc(`Paso: ${s.paso}\nPuesto: ${s.puesto}\n${s.producto==='totem'?`Producto: Tótem TVF\nSerie miniPC: ${s.serieMiniPC||s.serie}${s.modeloMiniPC?` (${s.modeloMiniPC})`:''}${s.ipMiniPC?`\nIP miniPC: ${s.ipMiniPC}`:''}${s.macMiniPC?`\nMAC miniPC: ${s.macMiniPC}`:''}${s.serieCamara?`\nCámara: ${s.serieCamara}${s.modeloCamara?` (${s.modeloCamara})`:''}`:''}${s.seriePantalla?`\nPantalla: ${s.seriePantalla}${s.modeloPantalla?` (${s.modeloPantalla})`:''}`:''}${s.equipoReemplazado?`\nEquipo reemplazado: ${s.equipoReemplazado}\nRetira: ${s.mmRetira||''} ${s.serieRetira}\nNuevo: ${s.mmNuevo||''} ${s.serieNuevo}`:''}${s.estadoMiniPC?`\nEstado miniPC: ${s.estadoMiniPC.cpu||''}${s.estadoMiniPC.ramTotal?` · RAM ${s.estadoMiniPC.ramUsada||'?'}/${s.estadoMiniPC.ramTotal}GB`:''}${s.estadoMiniPC.discoTotal?` · Disco ${s.estadoMiniPC.discoUsado||'?'}/${s.estadoMiniPC.discoTotal}`:''}${s.estadoMiniPC.so?` · ${s.estadoMiniPC.so}`:''}`:''}`:(s.producto==='tablet'?`Producto: Tablet\nSerie Tablet: ${s.serie}${s.deviceId?`\nDevice ID: ${s.deviceId}`:''}${s.ip?`\nIP: ${s.ip}`:''}${s.mac?`\nMAC: ${s.mac}`:''}${s.serieRetira?`\nRetira: ${s.serieRetira}${s.deviceIdRetira?` (Device ID: ${s.deviceIdRetira})`:''}\nNuevo: ${s.serieNuevo}${s.deviceIdNuevo?` (Device ID: ${s.deviceIdNuevo})`:''}`:''}`:`Serie PC: ${s.serie}${s.serieRetira?`\nRetira: ${s.serieRetira}\nNuevo: ${s.serieNuevo}`:''}`)}\nTipo: ${opLabel(s.opType)}${s.invDnd?`\nN° Inv. DND: ${s.invDnd}`:''}${s.invDnm?`\nN° Inv. DNM: ${s.invDnm}`:''}\nHora: ${new Date(s.timestamp).toLocaleString('es-AR')}${s.lat?`\nGPS: ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?` — ${s.address}`:''}`:''}${(s.checklistItems?checklistItemsLines(s.checklistItems):checklistLines(s.checklist)).length?`\n\nChecklist:\n${(s.checklistItems?checklistItemsLines(s.checklistItems):checklistLines(s.checklist)).join('\n')}`:''}${s.notas?`\n\nNotas:\n${s.notas}`:''}`),
            issuetype:{id:'10003'},...FIXED_FIELDS,...ASSIGNEE_FIELD,
            ...(hardwareAsociado ? { customfield_10050: mkDoc(hardwareAsociado) } : {})}
        });
        console.log('sendToJira: respuesta subtarea status=', sr.status, 'ok=', sr.ok);
      } catch(loopErr) {
        console.error('sendToJira: EXCEPCIÓN al llamar jiraCall para subtarea', s.id||s.fbId, loopErr);
        continue;
      }
      if(sr.ok){
        const st=await sr.json();
        subtaskKeys.push(st.key);
        console.log('sendToJira: subtarea creada OK:', st.key);
        // Save Jira ticket key onto the scan object itself (covers both localScans and scansSnapshot-sourced scans)
        s.jiraTicket = st.key;
        const si = localScans.findIndex(ls=>ls.id===s.id||ls.fbId===s.fbId);
        if (si>=0) localScans[si].jiraTicket = st.key;

        // Si es un cambio de equipo (incidencia), generar y adjuntar el Acta
        // → a la subtarea (uso interno) Y al ticket padre (visible para el cliente en el portal)
        if (s.opType === 'cambio_equipo') {
          try {
            const { doc: actaDoc, filename: actaFilename } = await buildActaReemplazoPDFDoc(rep, s);
            const actaDataUri = actaDoc.output('datauristring');
            const actaBase64 = actaDataUri.split(',')[1];
            // Adjuntar a la subtarea (uso interno de Danaide)
            const actaUpSubtask = await jiraUpload(st.key, actaFilename, actaBase64, 'application/pdf');
            if (!actaUpSubtask.ok) {
              console.error('Error al adjuntar Acta a subtarea:', await actaUpSubtask.text());
            } else {
              console.log('Acta adjuntada a subtarea', st.key);
            }
            // Adjuntar también al ticket padre (visible para el cliente en el portal JSM)
            const actaUpPadre = await jiraUpload(parentKey, actaFilename, actaBase64, 'application/pdf');
            if (!actaUpPadre.ok) {
              console.error('Error al adjuntar Acta al ticket padre:', await actaUpPadre.text());
            } else {
              console.log('Acta adjuntada al ticket padre', parentKey);
            }
          } catch(actaErr) {
            console.error('Error generando/adjuntando Acta de Reemplazo:', actaErr);
          }
        }
      } else {
        const errTxt = await sr.text();
        console.error(`Error creando subtarea para scan ${s.id||s.fbId} (${s.serie}):`, errTxt);
      }
    }
    console.log('sendToJira: loop terminado. subtaskKeys =', subtaskKeys);
    // Update report with Jira key (busca en localReports; si no está ahí, se actualiza igual en Firestore más abajo)
    const idx=localReports.findIndex(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
    let updatedSnapshot = scans; // scans ya tiene jiraTicket asignado en cada item del loop anterior
    if(idx>=0){
      localReports[idx].jiraKey=parentKey;
      localReports[idx].scansSnapshot = updatedSnapshot;
    }
    if(rep.fbId){
      try{
        await fbUpdateReport(rep.fbId,{jiraKey:parentKey, scansSnapshot: updatedSnapshot});
      }catch(e){}
    }
    // Persist locally
    try {
      localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(localScans.map(({photos,...s})=>({...s,photoCount:(photos||[]).length}))));
      localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(localReports.map(r=>({...r,scansSnapshot:(r.scansSnapshot||[]).map(({photos,...s})=>({...s}))}))));
    } catch(e) {}
    document.getElementById('modal-jira-content').innerHTML=`
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:36px;margin-bottom:10px">✅</div>
        <div style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:6px">${ticketExistente ? 'Informe cargado en ticket existente' : 'Ticket creado en Jira'}</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:var(--text);margin-bottom:6px">${parentKey}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${subtaskKeys.length} subtarea${subtaskKeys.length!==1?'s':''} creada${subtaskKeys.length!==1?'s':''}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--text3);background:var(--bg3);padding:8px;border-radius:8px">${subtaskKeys.join(' · ')}</div>
        <a href="${JIRA_BASE_URL}/browse/${parentKey}" target="_blank" style="display:inline-block;margin-top:16px;padding:12px 24px;background:var(--accent);color:#0a1628;border-radius:12px;font-weight:700;text-decoration:none;font-size:14px">Abrir en Jira →</a>
      </div>`;
    document.getElementById('modal-jira').classList.remove('hidden');
    showToast(`✓ Jira: ${parentKey}`,'success');
  } catch(e) { showJiraError(e.message); }
}
window.sendToJira = sendToJira;

function showJiraError(msg) {
  document.getElementById('modal-jira-content').innerHTML=`<div style="text-align:center;padding:16px 0"><div style="font-size:32px;margin-bottom:10px">❌</div><div style="font-size:15px;font-weight:600;color:var(--danger);margin-bottom:8px">Error al conectar con Jira</div><div style="font-size:11px;color:var(--text2);background:var(--bg3);padding:12px;border-radius:8px;font-family:var(--mono);text-align:left;word-break:break-all">${escHtml(msg)}</div></div>`;
  document.getElementById('modal-jira').classList.remove('hidden');
}

// ======== PAPELERA (informes/registros eliminados por técnicos) ========
let papeleraVisible = false;

async function togglePapelera() {
  papeleraVisible = !papeleraVisible;
  document.getElementById('sup-informes-list').classList.toggle('hidden', papeleraVisible);
  document.getElementById('sup-papelera-list').classList.toggle('hidden', !papeleraVisible);
  const btn = document.getElementById('btn-toggle-papelera');
  if (btn) btn.textContent = papeleraVisible ? '📋 Ver informes' : '🗑 Papelera';
  if (papeleraVisible) await renderPapelera();
}
window.togglePapelera = togglePapelera;

async function renderPapelera() {
  const cont = document.getElementById('sup-papelera-list');
  cont.innerHTML = `<div class="empty-state"><p>Cargando...</p></div>`;
  try {
    const [reports, scans] = await Promise.all([fbGetDeletedReports(), fbGetDeletedScans()]);
    if (!reports.length && !scans.length) {
      cont.innerHTML = `<div class="empty-state"><p>La papelera está vacía</p></div>`;
      return;
    }
    const fmtFecha = (ts) => ts?.seconds ? new Date(ts.seconds*1000).toLocaleString('es-AR') : '—';
    let html = '';
    if (reports.length) {
      html += `<div class="section-label" style="margin:10px 0">Informes eliminados (${reports.length})</div>`;
      html += reports.map(rep => `
        <div class="sup-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div>
              <div style="font-weight:600">${escHtml(rep.technicianName||'—')} — ${escHtml(rep.paso||'(sin paso)')}</div>
              <div style="font-size:11px;color:var(--text3)">Eliminado el ${fmtFecha(rep.eliminadoEn)} · ${rep.scanIds?.length||0} registros</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn-secondary small" onclick="restaurarInforme('${rep.fbId}')">↩ Restaurar</button>
              <button class="btn-ghost danger small" onclick="eliminarInformeDefinitivo('${rep.fbId}')">🗑 Eliminar</button>
            </div>
          </div>
        </div>`).join('');
    }
    if (scans.length) {
      html += `<div class="section-label" style="margin:14px 0 10px">Registros sueltos eliminados (${scans.length})</div>`;
      html += scans.map(s => `
        <div class="sup-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div>
              <div style="font-weight:600">${escHtml(s.paso||'(sin paso)')} — ${escHtml(s.puesto||'')}</div>
              <div style="font-size:11px;color:var(--text3)">Eliminado el ${fmtFecha(s.eliminadoEn)} · Serie: ${escHtml(s.serie||'—')}</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn-secondary small" onclick="restaurarRegistro('${s.fbId}')">↩ Restaurar</button>
              <button class="btn-ghost danger small" onclick="eliminarRegistroDefinitivo('${s.fbId}')">🗑 Eliminar</button>
            </div>
          </div>
        </div>`).join('');
    }
    cont.innerHTML = html;
  } catch(e) {
    cont.innerHTML = `<div class="empty-state"><p>Error al cargar la papelera</p></div>`;
  }
}

async function restaurarInforme(fbId) {
  try {
    await fbRestoreReport(fbId);
    showToast('Informe restaurado');
    await renderPapelera();
  } catch(e) { showToast('Error al restaurar'); }
}
window.restaurarInforme = restaurarInforme;

async function restaurarRegistro(fbId) {
  try {
    await fbRestoreScan(fbId);
    showToast('Registro restaurado');
    await renderPapelera();
  } catch(e) { showToast('Error al restaurar'); }
}
window.restaurarRegistro = restaurarRegistro;

async function eliminarInformeDefinitivo(fbId) {
  if (!confirm('Esto borra el informe DEFINITIVAMENTE, sin posibilidad de recuperarlo. ¿Continuar?')) return;
  try {
    await fbDeleteReport(fbId);
    showToast('Informe eliminado definitivamente');
    await renderPapelera();
  } catch(e) { showToast('Error al eliminar'); }
}
window.eliminarInformeDefinitivo = eliminarInformeDefinitivo;

async function eliminarRegistroDefinitivo(fbId) {
  if (!confirm('Esto borra el registro DEFINITIVAMENTE, sin posibilidad de recuperarlo. ¿Continuar?')) return;
  try {
    await fbDeleteScan(fbId);
    showToast('Registro eliminado definitivamente');
    await renderPapelera();
  } catch(e) { showToast('Error al eliminar'); }
}
window.eliminarRegistroDefinitivo = eliminarRegistroDefinitivo;

// ======== SUPERVISOR ========
function supTab(tab, btn) {
  document.querySelectorAll('.sup-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  ['informes','tecnicos','versiones','mapa','export','storage','viajes','programados'].forEach(t=>document.getElementById('sup-'+t).classList.toggle('hidden',t!==tab));
  if (tab==='mapa') {
    startLiveMap();
    // Leaflet necesita recalcular el tamaño si el mapa se inicializó mientras la pestaña estaba oculta
    setTimeout(() => { if (liveMapInstance) liveMapInstance.invalidateSize(); }, 100);
  }
  // Al abrir la pestaña Versiones, marcar la notificación como vista →
  // cambioDetectado=false en Firestore → el badge naranja desaparece automáticamente
  // via el onSnapshot de fbWatchVersionesObjetivo que ya está suscripto.
  if (tab==='versiones' && versionesObjetivo?.cambioDetectado) {
    fbMarcarVersionesVistas().catch(e => console.warn('Error marcando versiones vistas:', e));
  }
  if (tab==='programados') loadSupProgramados();
}
window.supTab = supTab;

// ── Supervisor: Viajes Programados ───────────────────────────
async function loadSupProgramados() {
  const el = document.getElementById('sup-programados-content');
  if (!el) return;
  el.innerHTML = '<div class="empty-state"><p>Cargando...</p></div>';
  try {
    const todos = await fbGetAllViajes();
    const programados = todos.filter(v => v.tipo === 'programacion' && !v.eliminado)
      .sort((a,b) => (b.fechaCreacion||'').localeCompare(a.fechaCreacion||''));
    if (programados.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>Sin viajes programados</p></div>';
      return;
    }
    const estadoConfig = {
      programado: { color:'#3b82f6', label:'Programado', icon:'🗓️' },
      'en curso':  { color:'#f59e0b', label:'En curso',  icon:'🚀' },
      completado:  { color:'#22c55e', label:'Completado', icon:'✅' },
    };
    const fmtFecha = iso => iso ? new Date(iso+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
    el.innerHTML = programados.map(v => {
      const cfg = estadoConfig[v.estado||'programado'] || estadoConfig.programado;
      const viajeros = (v.viajeros||[]).map(p=>`${p.nombre} ${p.apellido} (${p.empresa})`).join(', ')||'—';
      const paradas = (v.paradas||[]).map(p=>p.ciudad).filter(Boolean).join(' → ')||'—';
      const historial = (v.historialVersiones||[]).map(h=>
        `<div style="font-size:10px;color:var(--text3);padding:2px 0">v${h.version} → ${fmtFecha(h.fecha)}: ${escHtml(h.motivo||'Sin motivo')}</div>`
      ).join('');
      const id = v.fbId || v.id;
      return `<div style="background:var(--bg2);border-radius:12px;padding:14px;margin-bottom:10px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.proyecto||'—')}</div>
          <div style="color:${cfg.color};font-size:11px;font-weight:600">${cfg.icon} ${cfg.label} · v${v.version||1}</div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">👤 ${escHtml(v.userName||'—')} · ${escHtml(v.centroCosto||'—')}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">📅 ${fmtFecha(v.fechaInicio)} – ${fmtFecha(v.fechaFin)}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:2px">📍 ${escHtml(paradas)}</div>
        <div style="font-size:11px;color:var(--text2);margin-bottom:8px">👥 ${escHtml(viajeros)}</div>
        ${historial ? `<div style="border-top:1px solid var(--border);padding-top:6px;margin-top:6px;margin-bottom:8px"><div style="font-size:10px;font-weight:600;color:var(--text3);margin-bottom:2px">HISTORIAL DE VERSIONES</div>${historial}</div>` : ''}
        <button onclick="supEditarViajeProg('${id}')" style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text);font-size:12px;font-weight:600;cursor:pointer">✏️ Editar y generar informe</button>
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div class="empty-state"><p>Error: ${escHtml(e.message)}</p></div>`;
  }
}
window.loadSupProgramados = loadSupProgramados;

// Supervisor edita un viaje programado: lo carga en localViajes si no está
// y abre el wizard de reprogramación igual que hace el técnico
async function supEditarViajeProg(fbId) {
  // Buscar en localViajes primero
  let viaje = localViajes.find(v => v.fbId === fbId || v.id === fbId);

  // Si no está en memoria (completado o de otro técnico), cargarlo desde Firestore
  if (!viaje && navigator.onLine) {
    try {
      const todos = await fbGetAllViajes();
      viaje = todos.find(v => v.fbId === fbId);
      if (viaje && !localViajes.find(v => v.fbId === fbId)) {
        localViajes.push(viaje); // agregar temporalmente a memoria
      }
    } catch(e) { showToast('Error al cargar viaje: ' + e.message, 'error'); return; }
  }

  if (!viaje) { showToast('No se pudo cargar el viaje', 'error'); return; }

  // Usar la misma función que usa el técnico
  pvEditarViaje(fbId);

  // Asegurarse de que el modal esté visible (el supervisor puede estar en otra sección)
  document.getElementById('modal-programar-viaje')?.classList.remove('hidden');
}
window.supEditarViajeProg = supEditarViajeProg;

// ── Monitor de Storage R2 ────────────────────────────────────
async function loadStorageStats() {
  const el = document.getElementById('storage-stats-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Consultando storage...</div>';
  try {
    const res = await fetch(`${PHOTOS_PROXY_URL}/stats`, {
      headers: { 'X-ScanCheck-Token': PHOTOS_TOKEN }
    });
    if (!res.ok) throw new Error('Error ' + res.status);
    const d = await res.json();
    const pct = d.usePct || 0;
    const color = pct < 60 ? 'var(--accent)' : pct < 85 ? 'var(--warning)' : '#e53';
    el.innerHTML = `
      <div style="background:var(--bg2);border-radius:12px;padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--text)">Uso del bucket scancheck-photos</span>
          <span style="font-size:13px;font-weight:700;color:${color}">${pct}%</span>
        </div>
        <div style="background:var(--bg3);border-radius:99px;height:10px;overflow:hidden;margin-bottom:12px">
          <div style="background:${color};height:100%;width:${Math.min(pct,100)}%;border-radius:99px;transition:width .5s"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text)">${d.totalSizeMB} MB</div>
            <div style="font-size:11px;color:var(--text3)">Usado</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text3)">${(d.limitFreeMB/1024).toFixed(0)} GB</div>
            <div style="font-size:11px;color:var(--text3)">Límite gratuito</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text)">${d.totalFiles}</div>
            <div style="font-size:11px;color:var(--text3)">Fotos almacenadas</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--accent)">${(d.limitFreeMB - d.totalSizeMB).toFixed(0)} MB</div>
            <div style="font-size:11px;color:var(--text3)">Disponible</div>
          </div>
        </div>
        ${pct > 80 ? `<div style="margin-top:12px;padding:10px;background:#e5330022;border-radius:8px;font-size:12px;color:#e53;font-weight:600">⚠️ Uso elevado — considerá limpiar fotos antiguas para evitar cargos</div>` : ''}
      </div>
      <div style="font-size:11px;color:var(--text3);text-align:center">Límite gratuito de Cloudflare R2: 10 GB / mes · Sin costo de egress</div>
    `;
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53;font-size:13px">Error al consultar storage: ${e.message}</div>`;
  }
}
window.loadStorageStats = loadStorageStats;

let liveMapStarted=false;
async function renderSupervisor() {
  // Informes
  let allReports=localReports;
  try { allReports=await fbGetAllReports(); } catch(e) {}
  // Orden cronológico: más reciente primero (usa createdAt de Firestore si existe, sino la fecha del informe)
  // Ordenar cronológicamente dentro de cada técnico (más reciente primero)
  allReports = [...allReports].sort((a,b) => {
    const ta = a.createdAt?.seconds ? a.createdAt.seconds*1000 : new Date(a.date+'T12:00:00').getTime();
    const tb = b.createdAt?.seconds ? b.createdAt.seconds*1000 : new Date(b.date+'T12:00:00').getTime();
    return tb - ta;
  });
  const supList=document.getElementById('sup-informes-list');
  if(!allReports.length) { supList.innerHTML=`<div class="empty-state"><p>Sin informes</p></div>`; }
  else {
    // Agrupar por técnico manteniendo el orden cronológico dentro de cada grupo
    const byTech = new Map();
    allReports.forEach(rep => {
      const tech = rep.technicianName || '—';
      if (!byTech.has(tech)) byTech.set(tech, []);
      byTech.get(tech).push(rep);
    });
    // Ordenar técnicos por fecha del informe más reciente
    const techsSorted = [...byTech.entries()].sort((a,b) => {
      const ta = a[1][0].createdAt?.seconds ? a[1][0].createdAt.seconds*1000 : new Date(a[1][0].date+'T12:00:00').getTime();
      const tb = b[1][0].createdAt?.seconds ? b[1][0].createdAt.seconds*1000 : new Date(b[1][0].date+'T12:00:00').getTime();
      return tb - ta;
    });
    supList.innerHTML = techsSorted.map(([techName, reps]) => {
      const cards = reps.map(rep => {
        const d = new Date(rep.date+'T12:00:00');
        const label = d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
        const count = rep.scanIds?.length||0;
        // Obtener el paso del primer scan del snapshot si está disponible
        const paso = rep.paso || rep.scansSnapshot?.[0]?.paso || '—';
        const opType = rep.scansSnapshot?.[0]?.opType || '';
        const opBadge = opType ? `<span class="op-badge ${opType}" style="font-size:10px;padding:1px 7px;margin-left:6px">${opLabel(opType)}</span>` : '';
        return `<div class="sup-card" onclick="viewReportSupervisor('${rep.fbId||rep.id}')">
          <div class="sup-card-top">
            <div style="flex:1;min-width:0">
              <div class="sup-card-title" style="color:var(--accent)">${escHtml(paso)} ${opBadge}</div>
              <div class="sup-card-meta">${label} · ${count} dispositivo${count!==1?'s':''}</div>
              <div class="sup-card-meta">Inspector: ${escHtml(rep.inspectorName||'—')}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              ${rep.jiraKey?`<a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:3px 8px;border-radius:8px;font-family:var(--mono);display:block;margin-bottom:6px;text-decoration:underline">${rep.jiraKey}</a>`:''}
              <div class="history-badge">${count}</div>
            </div>
          </div>
        </div>`;
      }).join('');
      return `
        <div style="margin-bottom:6px;padding:8px 12px;background:var(--bg3);border-radius:10px;font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px">
          👤 ${escHtml(techName)} <span style="font-weight:400;color:var(--text3)">(${reps.length} informe${reps.length!==1?'s':''})</span>
        </div>
        ${cards}`;
    }).join('');
  }

  // Versiones AssureID — cumplimiento contra config/versiones_objetivo
  // Usamos TODOS los informes (incluidos los eliminados por técnicos desde su
  // panel) para que las métricas de cumplimiento no pierdan datos históricos.
  try {
    if (!versionesObjetivo) versionesObjetivo = await fbGetVersionesObjetivo();
    let allReportsParaMetricas = allReports;
    try { allReportsParaMetricas = await fbGetAllReports(true); } catch(e) {}
    const allScansVersion = allReportsParaMetricas.flatMap(r => r.scansSnapshot || []);
    const cump = calcularCumplimientoVersiones(allScansVersion);
    const vCont = document.getElementById('sup-versiones-content');
    if (!versionesObjetivo) {
      vCont.innerHTML = `<div class="empty-state"><p>Todavía no hay versión objetivo configurada (el monitor de GBG aún no corrió o no escribió datos).</p>
        <a href="https://gbgamericas.my.site.com/support/s/article/AssureID-AcuFill-MedicScan-Downloads" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:8px 12px;border-radius:8px;background:var(--accent);color:#0a1628;text-decoration:none;margin-top:10px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Descargar librerías (GBG)
        </a></div>`;
    } else {
      const pct = (ok, total) => total > 0 ? Math.round((ok/total)*100) : 0;
      const sentinelPct = pct(cump.sentinelOk, cump.sentinelTotal);
      const libraryPct = pct(cump.libraryOk, cump.libraryTotal);
      const fechaActualizado = versionesObjetivo.actualizadoEn?.seconds
        ? new Date(versionesObjetivo.actualizadoEn.seconds*1000).toLocaleString('es-AR')
        : '—';
      const pasosHtml = [...cump.porPaso.entries()].map(([paso, st]) => {
        const sp = pct(st.sentinelOk, st.sentinelTotal), lp = pct(st.libraryOk, st.libraryTotal);
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px">${escHtml(paso)}</span>
          <span style="font-size:12px;color:var(--text3)">Sentinel <b style="color:${sp===100?'var(--accent)':'var(--warning)'}">${sp}%</b> · Library <b style="color:${lp===100?'var(--accent)':'var(--warning)'}">${lp}%</b></span>
        </div>`;
      }).join('') || '<div class="empty-state"><p>Sin datos de versión en los registros aún</p></div>';

      vCont.innerHTML = `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:4px">
            <h3 style="margin:0">Versión objetivo actual</h3>
            <a href="https://gbgamericas.my.site.com/support/s/article/AssureID-AcuFill-MedicScan-Downloads" target="_blank" rel="noopener" style="flex-shrink:0;display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:8px 12px;border-radius:8px;background:var(--accent);color:#0a1628;text-decoration:none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargar librerías (GBG)
            </a>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:12px">Detectada en GBG el ${fechaActualizado}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div style="background:var(--bg3);border-radius:10px;padding:12px">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase">Sentinel</div>
              <div style="font-size:18px;font-weight:700">v${escHtml(versionesObjetivo.sentinel||'—')}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:4px">Promedio ${sentinelPct}% (tolerancia 45 días)</div>
            </div>
            <div style="background:var(--bg3);border-radius:10px;padding:12px">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase">Library</div>
              <div style="font-size:18px;font-weight:700">v${escHtml(versionesObjetivo.library||'—')}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:4px">Promedio ${libraryPct}% (tolerancia 90 días)</div>
            </div>
          </div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px">
          <h3 style="margin-bottom:10px">Cumplimiento por Paso</h3>
          ${pasosHtml}
        </div>
        ${cump.pcsDesactualizadas.length ? `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px">
          <h3 style="margin-bottom:10px">PCs desactualizadas (${cump.pcsDesactualizadas.length})</h3>
          ${cump.pcsDesactualizadas.map(pc => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
              <div style="font-weight:600">${escHtml(pc.paso)} — ${escHtml(pc.pcNombre||pc.puesto||'—')}</div>
              <div style="color:var(--text3)">${pc.sentinelOk===false?`Sentinel v${escHtml(pc.engine||'?')} `:''}${pc.libraryOk===false?`Library v${escHtml(pc.docLib||'?')}`:''}</div>
            </div>
          `).join('')}
        </div>` : ''}
      `;
    }
  } catch(e) { console.error('Error calculando cumplimiento de versiones:', e); }

  // Técnicos
  try {
    const users=await fbGetAllUsers();
    let locsByUser={};
    try {
      const locs=await fbGetAllLocations();
      locs.forEach(l=>{ if(l.userId) locsByUser[l.userId]=l; });
    } catch(e){}
    const tecList=document.getElementById('sup-tecnicos-list');
    const tecs=users.filter(u=>u.role==='tecnico');
    if(!tecs.length){tecList.innerHTML=`<div class="empty-state"><p>Sin técnicos registrados</p></div>`;}
    else {
      tecList.innerHTML=tecs.map(u=>{
        const uReports=allReports.filter(r=>r.userId===u.id);
        const loc=locsByUser[u.id];
        const t=loc?.updatedAt?.seconds?new Date(loc.updatedAt.seconds*1000).toLocaleString('es-AR'):'';
        return `<div class="sup-card">
          <div class="sup-card-top">
            <div>
              <div class="sup-card-title">${escHtml(u.name)}</div>
              <div class="sup-card-meta">${escHtml(u.email)}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:var(--text3)">Informes</div>
              <div style="font-size:22px;font-weight:700;color:var(--accent);font-family:var(--mono)">${uReports.length}</div>
            </div>
          </div>
          ${loc?.lat?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
            <div>
              <div style="font-size:11px;color:var(--accent);font-family:var(--mono)">📍 ${loc.lat.toFixed(6)}, ${loc.lon.toFixed(6)}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${escHtml((loc.address||'').split(',').slice(0,2).join(','))}</div>
              ${t?`<div style="font-size:10px;color:var(--text3);margin-top:2px">${t}</div>`:''}
            </div>
            <a href="https://maps.google.com/?q=${loc.lat},${loc.lon}" target="_blank" style="background:rgba(0,212,170,.1);border:1px solid rgba(0,212,170,.2);color:var(--accent);padding:6px 10px;border-radius:8px;font-size:11px;text-decoration:none;white-space:nowrap">Ver mapa →</a>
          </div>`:`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">Sin ubicación reciente</div>`}
        </div>`;
      }).join('');
    }
  } catch(e) {}
}

let liveMapInstance = null;
let liveMapMarkers = {}; // userId -> L.marker

function startLiveMap() {
  if (liveMapStarted) return;
  liveMapStarted = true;

  // Centro inicial aproximado (Buenos Aires); se ajusta automáticamente cuando llegan ubicaciones reales
  liveMapInstance = L.map('leaflet-map', { zoomControl: true }).setView([-34.6, -58.4], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(liveMapInstance);

  unsubLocations = fbWatchLocations(locs => {
    // Marcadores en el mapa Leaflet
    if (!liveMapInstance) return;
    const seenIds = new Set();
    locs.forEach(l => {
      if (!l.lat || !l.lon) return;
      const uid = l.userId || l.userName;
      seenIds.add(uid);
      const t = l.updatedAt?.seconds ? new Date(l.updatedAt.seconds*1000).toLocaleString('es-AR') : '';
      const popupHtml = `<strong>${escHtml(l.userName||'—')}</strong><br>${escHtml((l.address||'').split(',').slice(0,2).join(','))}<br><span style="color:#888;font-size:11px">${t}</span>`;
      if (liveMapMarkers[uid]) {
        liveMapMarkers[uid].setLatLng([l.lat, l.lon]).setPopupContent(popupHtml);
      } else {
        liveMapMarkers[uid] = L.marker([l.lat, l.lon]).addTo(liveMapInstance).bindPopup(popupHtml);
      }
    });
    // Quitar marcadores de técnicos que ya no están en la lista (dejaron de compartir ubicación)
    Object.keys(liveMapMarkers).forEach(uid => {
      if (!seenIds.has(uid)) {
        liveMapInstance.removeLayer(liveMapMarkers[uid]);
        delete liveMapMarkers[uid];
      }
    });
    // Encuadrar el mapa para mostrar todos los marcadores activos
    const activeMarkers = Object.values(liveMapMarkers);
    if (activeMarkers.length === 1) {
      liveMapInstance.setView(activeMarkers[0].getLatLng(), 14);
    } else if (activeMarkers.length > 1) {
      const group = L.featureGroup(activeMarkers);
      liveMapInstance.fitBounds(group.getBounds(), { padding: [30,30] });
    }
  });
}

async function viewReportSupervisor(id) {
  let allReports=[]; try{allReports=await fbGetAllReports();}catch(e){allReports=localReports;}
  const rep=allReports.find(r=>(r.fbId===id||r.id===id));
  if(!rep) return;
  viewingReportId=id;
  let allScans=localScans;
  try{const ms=await fbGetMyScans(rep.userId);allScans=[...localScans,...ms];}catch(e){}
  const scans=allScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
  let sig=rep.signature;
  if(!sig&&rep.fbId){try{sig=await fbGetSignature(rep.fbId);}catch(e){}}
  const d=new Date(rep.date+'T12:00:00');
  const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('view-report-content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div class="vr-title" style="margin:0">Informe de Visita</div>
      <img src="${DANAIDE_LOGO}" style="height:24px;object-fit:contain;opacity:.85">
    </div>
    <div class="vr-sub">${label} · ${contarDispositivos(scans)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector DNM',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: <a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(rep.jiraKey)}</a></div>`:''}
    ${scans.map((s,i)=>`<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:8px">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${(s.photoUrls?.length>0?s.photoUrls:(s.photos||[])).map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('')}

      ${(s.producto==='totem') ? `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:6px 0 4px">🗼 Tótem TVF</div>
      <div style="font-size:12px;color:var(--text2)">
        Serie miniPC: <strong style="color:var(--text)">${escHtml(s.serieMiniPC||s.serie||'—')}</strong>${s.modeloMiniPC?` (${escHtml(s.modeloMiniPC)})`:''} · Puesto: <strong style="color:var(--text)">${escHtml(s.puesto||'—')}</strong>
        ${s.ipMiniPC?` · IP: <strong>${escHtml(s.ipMiniPC)}</strong>`:''}${s.macMiniPC?` · MAC: <strong>${escHtml(s.macMiniPC)}</strong>`:''}
        ${s.serieCamara?`<br>Cámara: <strong>${escHtml(s.serieCamara)}</strong>${s.modeloCamara?` (${escHtml(s.modeloCamara)})`:''}`:''}
        ${s.seriePantalla?`<br>Pantalla: <strong>${escHtml(s.seriePantalla)}</strong>${s.modeloPantalla?` (${escHtml(s.modeloPantalla)})`:''}`:''}
        ${s.invDnd?` · N° Inv. DND: <strong>${escHtml(s.invDnd)}</strong>`:''}${s.invDnm?` · N° Inv. DNM: <strong>${escHtml(s.invDnm)}</strong>`:''}
        ${s.equipoReemplazado?`<br>Reemplazo: <strong>${escHtml(s.equipoReemplazado)}</strong> — Retira: <span style="color:var(--warning)">${escHtml(s.mmRetira||'')} ${escHtml(s.serieRetira||'')}</span> → Nuevo: <span style="color:var(--accent)">${escHtml(s.mmNuevo||'')} ${escHtml(s.serieNuevo||'')}</span>`:''}
        ${s.estadoMiniPC?`<br><span style="color:var(--text3)">🖥️ miniPC:</span> ${s.estadoMiniPC.cpu?`${escHtml(s.estadoMiniPC.cpu)}`:''}${s.estadoMiniPC.ramTotal?` · RAM ${escHtml(s.estadoMiniPC.ramUsada||'?')}/${escHtml(s.estadoMiniPC.ramTotal)}GB${s.estadoMiniPC.ramPct?` (${escHtml(s.estadoMiniPC.ramPct)}%)`:''}`:''}${s.estadoMiniPC.discoTotal?` · Disco ${escHtml(s.estadoMiniPC.discoUsado||'?')}/${escHtml(s.estadoMiniPC.discoTotal)}${s.estadoMiniPC.discoPct?` (${escHtml(s.estadoMiniPC.discoPct)})`:''}`:''}${s.estadoMiniPC.so?` · ${escHtml(s.estadoMiniPC.so)}`:''}`:''}
      </div>` : (s.producto==='tablet') ? `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:6px 0 4px">📱 Tablet</div>
      <div style="font-size:12px;color:var(--text2)">
        Serie: <strong style="color:var(--text)">${escHtml(s.serie||'—')}</strong> · Puesto: <strong style="color:var(--text)">${escHtml(s.puesto||'—')}</strong>
        ${s.deviceId?` · Device ID: <strong>${escHtml(s.deviceId)}</strong>`:''}${s.ip?` · IP: <strong>${escHtml(s.ip)}</strong>`:''}${s.mac?` · MAC: <strong>${escHtml(s.mac)}</strong>`:''}
        ${s.serieRetira?`<br>Retira: <span style="color:var(--warning)">${escHtml(s.serieRetira)}</span>${s.deviceIdRetira?` (${escHtml(s.deviceIdRetira)})`:''} → Nueva: <span style="color:var(--accent)">${escHtml(s.serieNuevo||'—')}</span>${s.deviceIdNuevo?` (${escHtml(s.deviceIdNuevo)})`:''}`:''}
      </div>` : `
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:6px 0 4px">🖨 Scanner DESKO</div>
      <div style="font-size:12px;color:var(--text2)">
        ${s.scannerSerie?`Serie: <strong style="color:var(--text)">${escHtml(s.scannerSerie)}</strong> · `:''}
        ${s.scannerModelo?`Modelo: <strong style="color:var(--text)">${escHtml(s.scannerModelo)}</strong> · `:''}
        Puesto: <strong style="color:var(--text)">${escHtml(s.puesto||'—')}</strong>
        ${s.invDnd?` · N° Inv. DND: <strong>${escHtml(s.invDnd)}</strong>`:''}
        ${s.invDnm?` · N° Inv. DNM: <strong>${escHtml(s.invDnm)}</strong>`:''}
        ${s.serieRetira?`<br>Retira: <span style="color:var(--warning)">${escHtml(s.serieRetira)}</span> → Nuevo: <span style="color:var(--accent)">${escHtml(s.serieNuevo||'—')}</span>`:''}
        ${s.instalacionReemplazoData?`<br>Equipo retirado: <span style="color:var(--text)">${escHtml(s.instalacionReemplazoData.marcaVieja)} — ${escHtml(s.instalacionReemplazoData.serieVieja)}</span>`:''}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">💻 PC</div>
      <div style="font-size:12px;color:var(--text2)">
        ${s.pcNombre?`Nombre: <strong>${escHtml(s.pcNombre)}</strong> · `:''}Serie PC: <strong>${escHtml(s.serie||'—')}</strong>
      </div>`}
      ${s.lat?`<div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:2px">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?' — '+escHtml(s.address):''}</div>`:''}
      ${s.jiraTicket?`<div style="font-size:10px;color:var(--accent2);font-family:var(--mono);margin-top:2px">🎫 <a href="${JIRA_BASE_URL}/browse/${escHtml(s.jiraTicket)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(s.jiraTicket)}</a></div>`:''}
      ${(!s.producto||s.producto==='scanner')?datosSistemaHtml(s.datosSistema):''}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">✅ Checklists</div>
      ${s.checklistItems?checklistItemsHtml(s.checklistItems):(s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist))}
      ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
      ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      ${s.opType==='reemplazo'?`<button class="btn-secondary" style="margin-top:8px;width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button>`:''}
    </div>`).join('')}
    <div class="vr-sig-label">Firma del Inspector DNM — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px;padding:8px">Sin firma</div>'}
  `;
  showPage('view-report');
}
window.viewReportSupervisor = viewReportSupervisor;

// ======== MIS TICKETS JIRA ========
// Carga los tickets de Jira asignados al técnico actual, filtrados por contrato DNM
// y estado pendiente (no resueltos ni cerrados).
let cachedJiraTickets = [];
let jiraTicketsLoading = false;

async function loadJiraTickets(forceRefresh = false) {
  if (jiraTicketsLoading) return;
  if (!currentUser?.email) return;
  if (cachedJiraTickets.length && !forceRefresh) {
    renderJiraTickets(cachedJiraTickets);
    return;
  }
  jiraTicketsLoading = true;

  // JQL: tickets del proyecto DND asignados al técnico, contrato DNM, no cerrados
  const jql = `project = DND AND assignee = "${currentUser.email}" AND "Contratos" = "Dirección Nacional de Migraciones" AND status not in (Resuelto, Cerrado, Done, Closed) ORDER BY created DESC`;

  try {
    const res = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/rest/api/3/search/jql',
        method: 'POST',
        jiraBody: {
          jql,
          maxResults: 20,
          fields: ['summary', 'status', 'priority', 'created', 'issuetype', 'customfield_10051']
        }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cachedJiraTickets = (data.issues || []).map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || '—',
      statusCategory: issue.fields.status?.statusCategory?.key || 'new',
      priority: issue.fields.priority?.name || '—',
      issuetype: issue.fields.issuetype?.name || '—',
      tipoTarea: issue.fields.customfield_10051?.value || null,
      created: issue.fields.created
    }));
    renderJiraTickets(cachedJiraTickets);
    updateJiraBadge(cachedJiraTickets.length);
  } catch(e) {
    console.error('Error cargando tickets Jira:', e);
    renderJiraTickets(null); // muestra error
  } finally {
    jiraTicketsLoading = false;
  }
}
window.loadJiraTickets = loadJiraTickets;

function updateVersionBadge() {
  const wrap = document.getElementById('version-badge-wrap');
  const badge = document.getElementById('version-badge');
  if (!wrap || !badge) return;
  if (currentUser?.role !== 'supervisor') { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  if (versionesObjetivo?.cambioDetectado) {
    badge.classList.remove('hidden'); badge.style.display = 'flex';
  } else {
    badge.classList.add('hidden');
  }
}

function updateJiraBadge(count) {
  const badge = document.getElementById('jira-badge');
  const badgeMenu = document.getElementById('jira-badge-menu');
  const homeWrap = document.getElementById('jira-tickets-home-wrap');
  if (count > 0) {
    if (badge) { badge.textContent = count > 9 ? '9+' : count; badge.classList.remove('hidden'); badge.style.display = 'flex'; }
    if (badgeMenu) { badgeMenu.textContent = count; badgeMenu.classList.remove('hidden'); }
    if (homeWrap) homeWrap.classList.remove('hidden');
  } else {
    if (badge) { badge.classList.add('hidden'); }
    if (badgeMenu) { badgeMenu.classList.add('hidden'); }
    if (homeWrap) homeWrap.classList.add('hidden');
  }
}

function jiraStatusColor(statusCategory) {
  if (statusCategory === 'done') return 'var(--accent)';
  if (statusCategory === 'indeterminate') return 'var(--warning)';
  return 'var(--text3)';
}

function renderJiraTicketCard(t, compact = false) {
  const fecha = t.created ? new Date(t.created).toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit'}) : '';
  const color = jiraStatusColor(t.statusCategory);
  return `<div class="scan-item" style="cursor:pointer" onclick="window.open('${JIRA_BASE_URL}/browse/${escHtml(t.key)}','_blank')">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
      <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent)">${escHtml(t.key)}</span>
      <span style="font-size:10px;font-weight:600;color:${color};background:${color}22;padding:2px 8px;border-radius:10px;white-space:nowrap">${escHtml(t.status)}</span>
    </div>
    <div style="font-size:13px;color:var(--text);margin-bottom:4px;line-height:1.3">${escHtml(t.summary)}</div>
    ${!compact ? `<div style="display:flex;gap:8px;flex-wrap:wrap">
      ${t.tipoTarea ? `<span style="font-size:10px;color:var(--text3)">📋 ${escHtml(t.tipoTarea)}</span>` : ''}
      <span style="font-size:10px;color:var(--text3)">🏷 ${escHtml(t.issuetype)}</span>
      ${fecha ? `<span style="font-size:10px;color:var(--text3)">📅 ${fecha}</span>` : ''}
    </div>` : ''}
  </div>`;
}

function renderJiraTickets(tickets) {
  const homeList = document.getElementById('jira-tickets-home-list');
  const pageList = document.getElementById('jira-tickets-page-list');

  if (tickets === null) {
    // Error al cargar
    const errHtml = `<div class="empty-state"><p style="color:var(--danger)">No se pudieron cargar los tickets. Verificá tu conexión.</p></div>`;
    if (homeList) homeList.innerHTML = errHtml;
    if (pageList) pageList.innerHTML = errHtml;
    return;
  }

  if (tickets.length === 0) {
    const emptyHtml = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg><p>Sin tickets pendientes asignados</p></div>`;
    if (homeList) homeList.innerHTML = emptyHtml;
    if (pageList) pageList.innerHTML = emptyHtml;
    return;
  }

  // Home: mostrar máximo 3 en modo compacto
  if (homeList) {
    homeList.innerHTML = tickets.slice(0, 3).map(t => renderJiraTicketCard(t, true)).join('');
  }
  // Página completa: todos con detalle
  if (pageList) {
    pageList.innerHTML = tickets.map(t => renderJiraTicketCard(t, false)).join('');
  }
}





// ======== SYNC ALL ========
async function syncAllReports() {
  const unsynced = localReports.filter(r => !r.fbId);
  if (!unsynced.length) { showToast('Todo sincronizado','success'); return; }
  showToast(`Sincronizando ${unsynced.length} informe${unsynced.length!==1?'s':''}...`);
  let ok = 0, lastErr = '';
  for (const rep of unsynced) {
    try {
      const repFb = {
        ...rep,
        scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
      };
      const fbId = await fbSaveReport(repFb);
      const ri = localReports.findIndex(r=>r.id===rep.id);
      if (ri>=0) localReports[ri].fbId = fbId;
      ok++;
    } catch(e) {
      lastErr = e.code||e.message||'Error';
      console.error('Sync failed:', rep.id, lastErr);
    }
  }
  // Persist updated fbIds
  try {
    const repsForStorage = localReports.map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...s})=>({...s}))
    }));
    localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(repsForStorage));
  } catch(e) {}
  renderHistory();
  if (ok > 0) showToast(`✓ ${ok} informe${ok!==1?'s':''} sincronizado${ok!==1?'s':''}`, 'success');
  else showToast(`Fallo: ${lastErr}`, 'error');
}
window.syncAllReports = syncAllReports;

// ======== GOOGLE SHEETS EXPORT ========
const PASOS_PROXY_URL = 'https://scancheck-pasos-proxy.elopapa.workers.dev';

// Mapeo nombre del paso -> ID de la página de detalle en argentina.gob.ar
// (URL: /seguridad/pasosinternacionales/detalle/ruta/{id}/{slug})
// Este ID es propio del sitio y NO coincide con el gid del IGN — se completa
// de a poco a medida que se van confirmando los IDs de cada paso.
// Formato: 'NOMBRE EN PASOS_COORDS': { id: NUMERO, slug: 'Slug-Con-Guiones' }
const PASOS_DETALLE_IDS = {
  'SICO': { id: 20, slug: 'Sico' },
  'SAN FRANCISCO': { id: 25, slug: 'San-Francisco' },
  'CARIRRIÑE': { id: 41, slug: 'Carirri%C3%B1e' },
  'ICALMA': { id: 38, slug: 'Icalma' },
  'HUA HUM': { id: 39, slug: 'Hua-Hum' },
  'MAMUIL MALAL': { id: 40, slug: 'Mamuil-Malal' },
  'PAMPA ALTA': { id: 54, slug: 'Pampa-Alta' },
  'COYHAIQUE': { id: 55, slug: 'Coyhaique' },
  'INTEGRACION AUSTRAL': { id: 68, slug: 'Integraci%C3%B3n-Austral' },
  'LOS AZULES': { id: 83, slug: 'Los-Azules' },
  'ROBALLOS': { id: 59, slug: 'Roballos' },
  // Agregar más a medida que se confirmen
};

// Construye la URL de la página de detalle del paso si tenemos el ID mapeado,
// sino devuelve la URL de búsqueda general (el técnico filtra manualmente).
function getUrlPasoArgentinaGobAr(nombrePaso) {
  if (!nombrePaso) return 'https://www.argentina.gob.ar/seguridad/pasosinternacionales';
  const nombre = nombrePaso.split(' - ')[0].split(' (')[0].trim().toUpperCase();
  const match = PASOS_DETALLE_IDS[nombre];
  if (match) {
    return `https://www.argentina.gob.ar/seguridad/pasosinternacionales/detalle/ruta/${match.id}/${match.slug}`;
  }
  return `https://www.argentina.gob.ar/seguridad/pasosinternacionales?search_api_fulltext=${encodeURIComponent(nombre)}`;
}
window.getUrlPasoArgentinaGobAr = getUrlPasoArgentinaGobAr;
const CLAUDE_PROXY_URL = 'https://scancheck-claude-proxy.elopapa.workers.dev';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJkYjcxYTYzOTE1YzQxMTVhYjBmMzdjN2FjYjJiNGE3IiwiaCI6Im11cm11cjY0In0=';
const APP_VERSION = '18.07.2026-v279'; // Fecha + nro de SW — actualizar junto con sw.js

// ── Cloudflare R2 Photos Proxy ───────────────────────────────
const PHOTOS_PROXY_URL = 'https://scancheck-photos-proxy.elopapa.workers.dev';
const PHOTOS_TOKEN     = 'SC_Photos2026_Danaide_XkP9mQ3rTv59828daNa'; // mismo valor que SCANCHECK_PHOTOS_TOKEN en el Worker

const JIRA_PROXY_URL = 'https://scancheck-jira-proxy.elopapa.workers.dev';
const JIRA_BASE_URL = 'https://danaide-enterprise.atlassian.net';
const GOOGLE_CLIENT_ID = '1033851892465-fdfkguq9uba6pfie61id75rhnnn4fj1h.apps.googleusercontent.com';
const GOOGLE_SHEET_ID  = '17lJBVQaLyxrYC_KoTjalnoZ7UhOkX2pT9xm0LhoIA54';
const SHEET_RANGE      = 'ScanCheck-App!A:Z';

let gsiTokenClient = null;
let gsiAccessToken = null;

function getGsiTokenClient() {
  if (gsiTokenClient) return gsiTokenClient;
  if (!window.google || !window.google.accounts) return null;
  gsiTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    callback: () => {} // overridden per-request
  });
  return gsiTokenClient;
}

function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const client = getGsiTokenClient();
    if (!client) { reject(new Error('Google Identity Services no cargó. Verificá tu conexión.')); return; }
    gsiTokenClient.callback = (resp) => {
      if (resp.error) { reject(new Error(resp.error)); return; }
      gsiAccessToken = resp.access_token;
      resolve(gsiAccessToken);
    };
    gsiTokenClient.requestAccessToken({ prompt: gsiAccessToken ? '' : 'consent' });
  });
}

// Parse AssureID fields from legacy pcData text (older scans before structured fields existed)
function parsePcDataAssure(pcData) {
  if (!pcData) return {};
  const get = (re) => { const m = pcData.match(re); return m ? m[1].trim() : ''; };
  return {
    engine: get(/Engine:\s*([^\s]+)/i),
    docLib: get(/DocLib:\s*([^\s]+)/i),
    licKey: get(/LicKey:\s*([^\s]+)/i)
  };
}

// Build flat rows from all scans (supervisor sees all via fbGetAllReports)
// Para cálculo de cumplimiento de versiones: nos interesa la ÚLTIMA visita de
// cada PC en TODA la historia (no por día como deduplicateScans), para no
// contar la misma PC más de una vez si tuvo varias visitas en momentos distintos.
function ultimaVisitaPorPC(allScans) {
  const map = new Map();
  allScans.forEach(s => {
    // Clave de PC: preferimos serie de PC, si no hay usamos paso+puesto+nombrePC como fallback
    const key = (s.serie || '').trim() || `${(s.paso||'').trim()}__${(s.puesto||'').trim()}__${(s.pcNombre||'').trim()}`;
    if (!key) return;
    const existing = map.get(key);
    const ts = s.timestamp ? new Date(s.timestamp).getTime() : 0;
    const existingTs = existing?.timestamp ? new Date(existing.timestamp).getTime() : -1;
    if (!existing || ts > existingTs) map.set(key, s);
  });
  return [...map.values()];
}

// Calcula el cumplimiento de versiones (Sentinel y Library, por separado) agrupado
// globalmente, por Paso, y por Provincia — a partir de la última visita de cada PC.
function calcularCumplimientoVersiones(allScans) {
  const ultimas = ultimaVisitaPorPC(allScans).filter(s => s.assureEngine || s.assureDocLib);
  const resultado = {
    total: ultimas.length,
    sentinelOk: 0, sentinelTotal: 0,
    libraryOk: 0, libraryTotal: 0,
    porPaso: new Map(),   // paso -> {sentinelOk, sentinelTotal, libraryOk, libraryTotal, pcs: []}
    pcsDesactualizadas: []
  };

  ultimas.forEach(s => {
    const { sentinelOk, sentinelScore, libraryOk, libraryScore } = evaluarCumplimientoVersion(s);
    const paso = (s.paso||'').trim() || '(Sin paso)';
    if (!resultado.porPaso.has(paso)) resultado.porPaso.set(paso, { sentinelOk:0, sentinelTotal:0, libraryOk:0, libraryTotal:0 });
    const pasoStats = resultado.porPaso.get(paso);

    if (sentinelOk !== null) {
      resultado.sentinelTotal++; pasoStats.sentinelTotal++;
      const sScore = sentinelScore ?? (sentinelOk ? 1 : 0);
      resultado.sentinelOk += sScore; pasoStats.sentinelOk += sScore;
    }
    if (libraryOk !== null) {
      resultado.libraryTotal++; pasoStats.libraryTotal++;
      const lScore = libraryScore ?? (libraryOk ? 1 : 0);
      resultado.libraryOk += lScore; pasoStats.libraryOk += lScore;
    }
    if (sentinelOk === false || libraryOk === false) {
      resultado.pcsDesactualizadas.push({
        paso, puesto: s.puesto, pcNombre: s.pcNombre, serie: s.serie,
        engine: s.assureEngine, docLib: s.assureDocLib,
        sentinelOk, libraryOk, timestamp: s.timestamp
      });
    }
  });

  return resultado;
}

function deduplicateScans(allScans) {
  // Regla: un registro por scanner por día, pero:
  // - Si el mismo scanner aparece en un PASO distinto ese día (cambia de PC, lo trasladan junto con
  //   la PC a otro puesto, o cualquier combinación), se considera otro evento — no se fusiona.
  // - Los reemplazos (serie retira + serie nueva) SIEMPRE se conservan aparte, nunca se fusionan con
  //   otro evento del mismo día, porque documentan un cambio físico de equipo.
  const reemplazos = [];
  const normales = [];
  allScans.forEach(s => {
    // cambio_equipo (nuevo nombre) y reemplazo (legacy) son siempre eventos únicos no deduplicables
    if (s.opType === 'cambio_equipo' || s.opType === 'reemplazo' || s.serieRetira) reemplazos.push(s);
    else normales.push(s);
  });

  const map = new Map();
  normales.forEach(s => {
    const day = s.timestamp ? localDateKey(s.timestamp) : 'sin-fecha';
    const serie = (s.scannerSerie || '').trim();
    const contextKey = `${(s.paso||'').trim()}__${(s.pcNombre||'').trim()}__${(s.puesto||'').trim()}__${(s.serie||'').trim()}`;
    const key = serie
      ? `${day}__serie:${serie}__ctx:${contextKey}`
      : `${day}__sinserie__ctx:${contextKey}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, s);
    } else {
      // Quedarse con el más reciente
      const existingTs = existing.timestamp ? new Date(existing.timestamp).getTime() : 0;
      const newTs = s.timestamp ? new Date(s.timestamp).getTime() : 0;
      if (newTs > existingTs) map.set(key, s);
    }
  });
  // Los reemplazos se devuelven todos, sin pasar por deduplicación
  return [...Array.from(map.values()), ...reemplazos];
}

// Traduce el valor técnico de scannerEstado (el mismo que devuelve Get-PnpDevice en
// Windows: OK/Unknown/Error/Degraded, más "Dañado" que es de selección manual) a la
// misma etiqueta en español que ve el técnico en el desplegable de la app.
// ── Versiones objetivo de AssureID (alimentadas por el GBG Monitor externo) ──
let versionesObjetivo = null; // {library, sentinel, actualizadoEn, fuente, cambioDetectado}
let unsubVersionesObjetivo = null;

// Compara dos strings de versión tipo "6.13.30.48" numéricamente, segmento a
// segmento. Devuelve true si `actual` es igual o más nueva que `objetivo`.
// Tolerante a formatos con distinta cantidad de segmentos (ej: "6.13.30" vs "6.13.30.48").
function versionEsActualOMasNueva(actual, objetivo) {
  if (!actual || !objetivo) return null; // sin datos suficientes para comparar
  const a = String(actual).split('.').map(n => parseInt(n, 10) || 0);
  const o = String(objetivo).split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(a.length, o.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] || 0, ov = o[i] || 0;
    if (av > ov) return true;
    if (av < ov) return false;
  }
  return true; // iguales
}

// Evalúa el cumplimiento de un scan contra las versiones objetivo vigentes.
// Devuelve {sentinelOk, sentinelScore, libraryOk, libraryScore} donde:
// - sentinelScore / libraryScore: 0.0-1.0 con tolerancia de días (fórmula lineal)
// - sentinelOk / libraryOk: true si score >= 0.5, false si no, null si sin dato
// La tolerancia evita que el % de cumplimiento caiga de 100% a 0% de golpe
// cuando GBG publica una versión nueva: baja en proporción a los días
// transcurridos desde que se detectó la versión objetivo.
const DOCLIB_TOLERANCIA_DIAS = 90;
const SENTINEL_TOLERANCIA_DIAS = 45;

// Días transcurridos desde que se detectó la versión objetivo actual en GBG.
// Se usa como "antigüedad de la versión" para el decay de Sentinel.
function diasDesdeVersionObjetivo() {
  const secs = versionesObjetivo?.actualizadoEn?.seconds;
  if (!secs) return null;
  return (Date.now() - secs * 1000) / (1000 * 60 * 60 * 24);
}

function calcSentinelScore(scan) {
  if (!versionesObjetivo?.sentinel) return null;
  const esActual = versionEsActualOMasNueva(scan.assureEngine, versionesObjetivo.sentinel);
  if (esActual === null) return null;   // sin dato de versión en el scan
  if (esActual) return 1.0;             // al día o más nuevo → 100%
  // Atrasado: el score decae según cuántos días hace que salió la versión objetivo.
  // 0 días desde el lanzamiento → 1.0 (100%), 45+ días → 0.0. Lineal en el medio.
  const diasVersion = diasDesdeVersionObjetivo();
  if (diasVersion === null) return 0.0; // sin fecha de la versión = sin tolerancia
  return Math.max(0, 1 - diasVersion / SENTINEL_TOLERANCIA_DIAS);
}

function calcLibraryScore(scan) {
  if (!versionesObjetivo?.library) return null;
  // Primero verificar si la versión es igual o más nueva
  const esActual = versionEsActualOMasNueva(scan.assureDocLib, versionesObjetivo.library);
  if (esActual) return 1.0;
  if (esActual === null) return null;
  // Si no es actual, calcular score basado en fecha de actualización del scan
  const fechaActualizacion = scan.datosSistema?.docLibFecha || null;
  if (!fechaActualizacion) return 0.0; // sin fecha = sin dato = score mínimo
  const diasRetraso = (Date.now() - new Date(fechaActualizacion).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - diasRetraso / DOCLIB_TOLERANCIA_DIAS);
}

function evaluarCumplimientoVersion(scan) {
  if (!versionesObjetivo) return { sentinelOk: null, sentinelScore: null, libraryOk: null, libraryScore: null };
  const sentinelScore = calcSentinelScore(scan);
  const sentinelOk = sentinelScore === null ? null : sentinelScore >= 0.5;
  const libraryScore = calcLibraryScore(scan);
  const libraryOk = libraryScore === null ? null : libraryScore >= 0.5;
  return { sentinelOk, sentinelScore, libraryOk, libraryScore };
}

const SCANNER_ESTADO_LABELS = {
  'OK': 'OK',
  'Unknown': 'Desconectado',
  'Error': 'Error',
  'Degraded': 'Falla',
  'Dañado': 'Dañado'
};
function scannerEstadoLabel(estado) {
  if (!estado) return '';
  return SCANNER_ESTADO_LABELS[estado] || estado;
}

// Filas de exportación para la hoja "Totems"
function buildTotemExportRows(allScans) {
  const totems = allScans.filter(s => s.producto === 'totem');
  const headers = [
    'Fecha', 'Hora', 'Técnico', 'Inspector DNM', 'Paso', 'Puesto', 'Tipo Operación',
    'Serie miniPC', 'Modelo miniPC', 'IP miniPC', 'MAC miniPC', 'Serie Cámara', 'Modelo/Marca Cámara',
    'Serie Pantalla', 'Modelo/Marca Pantalla', 'N° Inv. DND', 'N° Inv. DNM',
    'Checklist OK', 'Checklist Detalle',
    'Equipo Reemplazado', 'Marca/Modelo Retira', 'Serie Retira', 'Marca/Modelo Nuevo', 'Serie Nuevo',
    'CPU', 'CPU Cores', 'RAM Total (GB)', 'RAM Usada (GB)', 'RAM Uso %',
    'SO', 'Kernel', 'Disco Total', 'Disco Usado', 'Disco Libre', 'Disco Uso %', 'Estado Capturado',
    'Latitud', 'Longitud', 'Dirección', 'Notas'
  ];
  const rows = [headers];
  totems.forEach(s => {
    const d = new Date(s.timestamp);
    const items = s.checklistItems || [];
    const oks = items.filter(i => i.ok).length;
    const e = s.estadoMiniPC || {};
    rows.push([
      d.toLocaleDateString('es-AR'), d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}),
      s.technicianName || '', s.inspectorName || '', s.paso || '', s.puesto || '',
      opLabel(s.opType) || s.opType || '',
      s.serieMiniPC || s.serie || '', s.modeloMiniPC || '',
      s.ipMiniPC || '', s.macMiniPC || '',
      s.serieCamara || '', s.modeloCamara || '',
      s.seriePantalla || '', s.modeloPantalla || '',
      s.invDnd || '', s.invDnm || '',
      items.length ? `${oks}/${items.length}` : '',
      items.map(i => `${i.ok?'OK':'—'} ${i.label}`).join(' | '),
      s.equipoReemplazado || '', s.mmRetira || '', s.serieRetira || '', s.mmNuevo || '', s.serieNuevo || '',
      e.cpu || '', e.cores || '', e.ramTotal || '', e.ramUsada || '', e.ramPct || '',
      e.so || '', e.kernel || '', e.discoTotal || '', e.discoUsado || '', e.discoLibre || '', e.discoPct || '', e.capturadoEn || '',
      s.lat != null ? s.lat : '', s.lon != null ? s.lon : '', s.address || '', s.notas || ''
    ]);
  });
  return rows;
}

// Filas de exportación para la hoja "Tablets"
function buildTabletExportRows(allScans) {
  const tablets = allScans.filter(s => s.producto === 'tablet');
  const headers = [
    'Fecha', 'Hora', 'Técnico', 'Inspector DNM', 'Paso', 'Puesto', 'Tipo Operación',
    'Serie Tablet', 'Device ID', 'IP', 'MAC Add',
    'Checklist OK', 'Checklist Detalle',
    'Serie Retira', 'Device ID Retira', 'Serie Nueva', 'Device ID Nueva',
    'Latitud', 'Longitud', 'Dirección', 'Notas'
  ];
  const rows = [headers];
  tablets.forEach(s => {
    const d = new Date(s.timestamp);
    const items = s.checklistItems || [];
    const oks = items.filter(i => i.ok).length;
    rows.push([
      d.toLocaleDateString('es-AR'), d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}),
      s.technicianName || '', s.inspectorName || '', s.paso || '', s.puesto || '',
      opLabel(s.opType) || s.opType || '',
      s.serie || '', s.deviceId || '', s.ip || '', s.mac || '',
      items.length ? `${oks}/${items.length}` : '',
      items.map(i => `${i.ok?'OK':'—'} ${i.label}`).join(' | '),
      s.serieRetira || '', s.deviceIdRetira || '', s.serieNuevo || '', s.deviceIdNuevo || '',
      s.lat != null ? s.lat : '', s.lon != null ? s.lon : '', s.address || '', s.notas || ''
    ]);
  });
  return rows;
}

function buildExportRows(allScans) {
  // Solo scanners — los tótems/tablets van a sus propias hojas
  const soloScanners = allScans.filter(s => !s.producto || s.producto === 'scanner');
  const deduplicated = deduplicateScans(soloScanners);
  const headers = [
    'Fecha', 'Técnico', 'Inspector DNM', 'Paso', 'Tipo Operación',
    'Puesto', 'Nombre PC', 'Serie PC',
    'Serie Scanner', 'Modelo Scanner', 'Estado Scanner', 'N° Inv. DND', 'N° Inv. DNM',
    'AssureID Engine', 'AssureID DocLib', 'AssureID LicKey',
    'Sentinel Actualizado', 'Library Actualizado',
    'Latitud', 'Longitud', 'Dirección',
    'Serie Retira', 'Serie Nueva', 'Falla Detectada (Acta)',
    'Equipo Retirado (Contrato Anterior) Marca', 'Equipo Retirado (Contrato Anterior) Serie',
    'Ticket Jira',
    'Check Vidrio', 'Check Cable USB', 'Check Fuente', 'Check Limpieza',
    'Cámara Web', 'Cámara Web Marca/Modelo'
  ];
  console.log(`Export: ${allScans.length} registros → ${deduplicated.length} tras deduplicar`);
  const rows = deduplicated.map(s => {
    const legacy = parsePcDataAssure(s.pcData);
    if (!s.assureEngine && !legacy.engine) console.warn('No AssureID data for scan', s.id, '— pcData:', s.pcData?.substring(0,100));
    const ck = s.checklist || {};
    const fk = s.actaReemplazo?.fallaChecklist;
    const fallaResumen = fk ? Object.keys(FALLA_LABELS).filter(k=>fk[k]).map(k=>FALLA_LABELS[k]).concat(fk.otro?[`Otro: ${fk.otroTexto||''}`]:[]).join(' | ') : '';
    // Cumplimiento de versión para Sheets: "Sí"/"No" según la versión EXACTA
    // (comparación directa, sin la tolerancia con decay que usa la métrica de la app).
    // Así la columna refleja el estado real de cada PC, no el % de la ventana de gracia.
    const { libraryOk } = evaluarCumplimientoVersion(s);
    const sentinelExacto = versionEsActualOMasNueva(s.assureEngine, versionesObjetivo?.sentinel);
    const cumplimientoLabel = (ok) => ok === null ? '' : (ok ? 'Sí' : 'No');
    return [
      s.timestamp ? new Date(s.timestamp).toLocaleString('es-AR') : '',
      s.userName || s.technicianName || '',
      s.inspectorName || '',
      s.paso || '',
      opLabel(s.opType),
      s.puesto || '',
      s.pcNombre || '',
      s.serie || '',
      s.scannerSerie || '',
      s.scannerModelo || '',
      scannerEstadoLabel(s.scannerEstado),
      s.invDnd || '',
      s.invDnm || '',
      s.assureEngine || legacy.engine || '',
      s.assureDocLib || legacy.docLib || '',
      s.assureLicKey || legacy.licKey || '',
      cumplimientoLabel(sentinelExacto),
      cumplimientoLabel(libraryOk),
      s.lat != null ? s.lat : '',
      s.lon != null ? s.lon : '',
      s.address || '',
      s.serieRetira || '',
      s.serieNuevo || '',
      fallaResumen,
      s.instalacionReemplazoData?.marcaVieja || '',
      s.instalacionReemplazoData?.serieVieja || '',
      s.jiraTicket || '',
      ck.vidrio ? 'OK' : '',
      ck.cableUsb ? 'OK' : '',
      ck.fuente ? 'OK' : '',
      ck.limpieza ? 'OK' : '',
      ck.camaraWeb ? 'Sí' : 'No',
      ck.camaraWeb ? (ck.camaraWebMarca || '') : ''
    ];
  });
  return [headers, ...rows];
}

async function exportToGoogleSheets() {
  const btn = document.getElementById('btn-export-sheets');
  const statusEl = document.getElementById('export-status');
  btn.disabled = true; btn.style.opacity = '0.6';
  statusEl.textContent = 'Iniciando sesión con Google...';

  try {
    await getGoogleAccessToken();
    statusEl.textContent = 'Recopilando datos de todos los técnicos...';

    // Asegurar que tengamos la versión objetivo cargada para las columnas de
    // cumplimiento, sin depender de que el supervisor haya abierto antes la
    // pestaña "Versiones" (que es la que normalmente la carga).
    if (!versionesObjetivo) {
      try { versionesObjetivo = await fbGetVersionesObjetivo(); } catch(e) {}
    }

    // Collect all scans: from all reports' scansSnapshot (supervisor sees all reports)
    let allReports = [];
    try {
      allReports = await fbGetAllReports(true); // incluye eliminados: el export conserva todo el histórico
    } catch(e) {
      // Fallback to local data if offline
      allReports = localReports;
    }

    const allScans = [];
    allReports.forEach(rep => {
      (rep.scansSnapshot||[]).forEach(s => {
        allScans.push({ ...s, inspectorName: rep.inspectorName, technicianName: rep.technicianName });
      });
    });

    if (allScans.length === 0) {
      statusEl.textContent = 'No hay registros para exportar.';
      btn.disabled = false; btn.style.opacity = '1';
      return;
    }

    statusEl.textContent = `Exportando ${allScans.length} registros...`;

    const rows = buildExportRows(allScans);
    const exportedCount = rows.length - 1; // -1 por headers
    const duplicatesRemoved = allScans.length - exportedCount;

    // Clear existing content first, then write
    const sheetRangeEncoded = encodeURIComponent(SHEET_RANGE);
    const clearRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${sheetRangeEncoded}:clear`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' }
    });
    if (!clearRes.ok) {
      const err = await clearRes.json().catch(()=>({}));
      throw new Error(`Error al limpiar la hoja: ${err.error?.message || `HTTP ${clearRes.status}`}`);
    }

    const writeRange = encodeURIComponent('ScanCheck-App!A1');
    const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${writeRange}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows })
    });

    if (!writeRes.ok) {
      const err = await writeRes.json().catch(()=>({}));
      throw new Error(err.error?.message || `HTTP ${writeRes.status}`);
    }

    // ── Hoja Totems (si hay registros de tótem) ──
    let totemMsg = '';
    const totemRows = buildTotemExportRows(allScans);
    if (totemRows.length > 1) {
      statusEl.textContent = `Exportando ${totemRows.length - 1} tótems...`;
      try {
        const clearT = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent('Totems!A:Z')}:clear`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' }
        });
        if (!clearT.ok) {
          const err = await clearT.json().catch(()=>({}));
          throw new Error(err.error?.message || `HTTP ${clearT.status} — ¿existe la hoja "Totems" en el Sheet?`);
        }
        const writeT = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent('Totems!A1')}?valueInputOption=RAW`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: totemRows })
        });
        if (!writeT.ok) {
          const err = await writeT.json().catch(()=>({}));
          throw new Error(err.error?.message || `HTTP ${writeT.status}`);
        }
        totemMsg = ` + ${totemRows.length - 1} tótems`;
      } catch(e) {
        console.warn('Export Totems:', e.message);
        totemMsg = ` (hoja Totems: ${e.message})`;
      }
    }

    // ── Hoja Tablets (si hay registros de tablet) ──
    let tabletMsg = '';
    const tabletRows = buildTabletExportRows(allScans);
    if (tabletRows.length > 1) {
      statusEl.textContent = `Exportando ${tabletRows.length - 1} tablets...`;
      try {
        const clearTb = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent('Tablets!A:Z')}:clear`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' }
        });
        if (!clearTb.ok) {
          const err = await clearTb.json().catch(()=>({}));
          throw new Error(err.error?.message || `HTTP ${clearTb.status} — ¿existe la hoja "Tablets" en el Sheet?`);
        }
        const writeTb = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${encodeURIComponent('Tablets!A1')}?valueInputOption=RAW`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: tabletRows })
        });
        if (!writeTb.ok) {
          const err = await writeTb.json().catch(()=>({}));
          throw new Error(err.error?.message || `HTTP ${writeTb.status}`);
        }
        tabletMsg = ` + ${tabletRows.length - 1} tablets`;
      } catch(e) {
        console.warn('Export Tablets:', e.message);
        tabletMsg = ` (hoja Tablets: ${e.message})`;
      }
    }

    const dupMsg = duplicatesRemoved > 0 ? ` (${duplicatesRemoved} duplicados eliminados)` : '';
    statusEl.textContent = `✓ ${exportedCount} registros exportados${totemMsg}${tabletMsg}${dupMsg}.`;
    showToast(`✓ ${exportedCount} registros${totemMsg}${tabletMsg} exportados a Sheets${dupMsg}`, 'success');

  } catch(e) {
    console.error('Export error:', e);
    statusEl.textContent = 'Error: ' + e.message;
    showToast('Error al exportar: ' + e.message, 'error');
  } finally {
    btn.disabled = false; btn.style.opacity = '1';
  }
}
window.exportToGoogleSheets = exportToGoogleSheets;

// ======== TOAST ========
let toastTimer;
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast'+(type?' '+type:''); t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.add('hidden'),2800);
}

function escHtml(str){return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
