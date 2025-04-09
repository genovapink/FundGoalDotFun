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
	--optimize \
	--optimizer-runs 200 \
	--skip-simulation \
	--verify

# --gas-limit 1000000 \
# --gas-price 1000000000 \

# --verify \
# --etherscan-api-key $$ETHERSCAN_API_KEY