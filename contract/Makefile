.PHONY: deploy
deploy:
	set +a; \
	source .env; \
	set -a; \
	forge script \
	script/DeployScript.s.sol:DeployScript \
	--rpc-url $$RPC_URL \
	--private-key $$PRIVATE_KEY \
	--broadcast \
	--verify \
	--etherscan-api-key $$ETHERSCAN_API_KEY